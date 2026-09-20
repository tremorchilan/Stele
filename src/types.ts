export type Role =
  | 'dweller'
  | 'aspirant'
  | 'member'
  | 'loyal_core'
  | 'steward'
  | 'teacher'
  | 'authority'
  | 'alumni';

export type Scope = 'district' | 'division' | 'national' | 'international';

export type Provenance = 'Official' | 'Institutional' | 'Peer';

export type NaturalPalette = 'sunset' | 'afternoon' | 'seaside';

export interface SteleItem {
  id: string;
  title: string;
  sourceInstitution: string;
  sourceSpace: string;
  stewardName: string;
  provenance: Provenance;
  scope: Scope;
  deadline: string; // ISO date string
  originalMessage: string;
  tags: string[];
  endorsedBy?: string[];
  isInstitutionOnly?: boolean;
  reachCount?: number;
  unseenCount?: number;
  lowFairnessFlag?: boolean;
  requiresStage?: string;
  linkedWikiPageId?: string;
  thumbnailUrl?: string;
}

export interface Commitment {
  id: string;
  itemId: string;
  title: string;
  sourceInstitution: string;
  stewardName: string;
  deadline: string;
  thumbnailUrl?: string;
  type: 'self_chosen' | 'delegated';
  witnessName?: string;
  witnessedAt?: string;
  status: 'active' | 'watched' | 'completed' | 'missed';
  completedAt?: string;
  retrospective?: {
    wentWell: string;
    wentWrong: string;
    toChange: string;
  };
}

export interface NoticeItem {
  id: string;
  title: string;
  issuer: string;
  scope: 'institutional' | 'national';
  timestamp: string;
  summary: string;
  isUrgent?: boolean;
  reachPercentage?: number;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  leadSteward: string;
  deputySteward: string;
  memberCount: number;
  activeOpportunities: number;
  tags: string[];
  handoverPending?: boolean;
}

export interface WikiPage {
  id: string;
  clubId: string;
  title: string;
  type: 'Charter' | 'Playbook' | 'Retrospective' | 'Ledger' | 'Resources' | 'Handover';
  visibility: 'public' | 'core' | 'steward';
  lastEditedBy: string;
  lastEditedDate: string;
  content: string;
  version: number;
}

export interface LedgerEntry {
  id: string;
  studentName: string;
  action: string;
  moment: string;
  witnessName?: string;
  witnessRole?: string;
  isWitnessed: boolean;
  institution: string;
  hash: string;
}

export interface MemberPipelinePerson {
  id: string;
  name: string;
  role: 'Observer' | 'Applicant' | 'Trialist' | 'Core' | 'Steward';
  joinedDate: string;
  promotedBy?: string;
  claimedCount: number;
  completedCount: number;
  abandonedCount: number;
  lastActive: string;
}

export interface RewardLogItem {
  id: string;
  type: 'streak' | 'completion' | 'early_bonus' | 'notice_view' | 'retrospective' | 'opportunity_star' | 'task_claim' | 'perk_redemption';
  title: string;
  points: number;
  timestamp: string;
  details?: string;
}

export interface CampusPerk {
  id: string;
  title: string;
  category: 'cafeteria' | 'workshop' | 'library' | 'events' | 'academic';
  cost: number;
  location: string;
  availability: string;
  description: string;
  counterInstructions: string;
  iconName: string;
}

export interface ClaimedPerkVoucher {
  id: string;
  perkId: string;
  perkTitle: string;
  cost: number;
  claimedAt: string;
  voucherCode: string;
  qrValue: string;
  location: string;
  counterInstructions: string;
  status: 'active' | 'used';
}

export interface DispatchMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: Role;
  senderAvatar?: string;
  timestamp: string;
  content: string;
  isOfficial?: boolean;
  linkedCommitmentId?: string;
  actionableTask?: {
    title: string;
    deadline: string;
    points: number;
  };
  isEncrypted?: boolean;
  surveillanceShielded?: boolean;
  isAiResponse?: boolean;
}

export type ChannelCategory =
  | 'authority'
  | 'faculty'
  | 'section'
  | 'class'
  | 'club'
  | 'noninstitutional'
  | 'dm';

export type PrivacySphere =
  | 'public_institutional' // Witnessed by faculty & authority
  | 'student_commons'     // Strict student-only enclave; zero authority surveillance
  | 'peer_encrypted';     // End-to-end peer encrypted direct message

export interface CommunicationChannel {
  id: string;
  name: string;
  slug: string;
  category: ChannelCategory;
  privacySphere: PrivacySphere;
  allowedRoles: Role[];
  clubId?: string;
  description: string;
  unreadCount: number;
  isMuted: boolean;
  participantCount: number;
  quietHours: string;
  isDirectMessage?: boolean;
  dmPeerName?: string;
  dmPeerRole?: Role;
  dmPeerAvatar?: string;
  antiSurveillanceGuarantee: string;
  ephemeralDays?: number;
  topic?: string;
}

export interface InstitutionalKnowledgeQuery {
  id: string;
  question: string;
  answer: string;
  category: string;
  sourceDoc: string;
  verifiedBy: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  dateEarned: string;
  fact: string;
  iconName: string;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  institution: string;
  section: string;
  district: string;
  federationId: string;
  role: Role;
  joinedDate: string;
  avatarUrl?: string;

  // Unified Reward Circuit (Sensory Reward, WP §18)
  score: number; // Rolling points (90-day horizon)
  dailyStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  completedCommitmentsCount: number;
  earlyDeliveriesCount: number;
  noticesInspectedCount: number;
  retrospectivesContributedCount: number;

  badges: StudentBadge[];
  rewardHistory: RewardLogItem[];
  claimedPerks?: ClaimedPerkVoucher[];
}

export interface AcademicClassSchedule {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: string;
  startTime: string;
  endTime: string;
  courseName: string;
  courseCode: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar?: string;
  room: string;
  building: string;
  currentTopic: string;
  requiredMaterials: string[];
  syllabusModule: string;
  officeHours: string;
  status?: 'upcoming' | 'in_progress' | 'completed';
}

export interface AcademicSyllabus {
  id: string;
  courseCode: string;
  title: string;
  department: string;
  credits: number;
  term: string;
  instructor: string;
  instructorRole: string;
  officeDesk: string;
  description: string;
  modules: {
    number: number;
    name: string;
    durationWeeks: number;
    topics: string[];
  }[];
  prescribedTextbooks: {
    title: string;
    author: string;
    edition: string;
    status: 'In Library' | 'Digital Reserve' | 'Free PDF';
  }[];
  evaluationRubric: {
    component: string;
    weight: number;
    details: string;
  }[];
  downloadFileName: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  category: 'off_day' | 'exam' | 'deadline' | 'recess' | 'milestone';
  term: string;
  description: string;
  affectsTimetable: boolean;
  syncedWithExternal?: boolean;
}

export interface SyllabusUpdateNotification {
  id: string;
  syllabusId: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  changeType: 'rubric' | 'module' | 'textbook' | 'deadline';
  summary: string;
  author: string;
  read: boolean;
}

export interface CampusQuietZone {
  id: string;
  name: string;
  location: string;
  noiseDb: number;
  noiseLevel: 'Silent' | 'Whisper' | 'Collaborative';
  availablePods: number;
  totalPods: number;
  powerOutlets: boolean;
  wifiSpeedMbps: number;
}

export interface FriendPeer {
  id: string;
  name: string;
  handle: string;
  sovereignAddress: string;
  section: string;
  role: Role;
  avatar?: string;
  trustLevel: 'Inner Sovereign' | 'Study Partner' | 'Club Peer' | 'Fellow Scholar';
  mutualCommitments: number;
  clubAffiliations: string[];
  status: 'online' | 'in_study_pod' | 'in_lab' | 'quiet_mode';
  statusMessage?: string;
  lastExchange: string;
  mutualCircleCount: number;
  verifiedDate: string;
  isFavorite?: boolean;
}

