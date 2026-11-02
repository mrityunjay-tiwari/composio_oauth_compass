export interface ScopeDefinition {
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "restricted";
  triggersReview: boolean;
  casaTier?: number;
  composioActions: string[];
}

export interface AppGuide {
  id: string;
  name: string;
  slug: string;
  category: "Productivity" | "Communication" | "Developer Tools" | "CRM & Sales" | "Media & Content";
  logo: string;
  developerPortalUrl: string;
  docsUrl: string;
  frictionScore: number; // 1 to 5
  setupTimeMinutes: number;
  approvalWaitDays: number;
  financialCost: string; // e.g., "$0" or "$3,000 - $15,000 (CASA Tier 2)"
  composioManagedAvailable: boolean;
  manifestSupported: boolean;
  pkceRequired: boolean;
  reviewRequiredForLaunch: boolean;
  reviewType: "None" | "Workspace Admin Only" | "App Directory Review" | "Google CASA Tier 2" | "Quota Extension Request";
  isLiveInvestigated?: boolean;
  
  summary: string;
  
  // Step by Step Guidance
  steps: {
    id: number;
    title: string;
    description: string;
    actor: "human" | "agent" | "hybrid";
    portalUrl?: string;
    codeSnippet?: string;
    gotchaWarning?: string;
  }[];

  // Agent vs Human Boundary
  agentCanDo: string[];
  humanMustDo: string[];

  // Unwritten Gotchas & Traps
  gotchas: {
    title: string;
    severity: "critical" | "warning" | "tip";
    description: string;
    evidenceType: "tested_reality" | "unwritten_rule" | "community_consensus";
  }[];

  // Scopes & Minimizer
  scopes: ScopeDefinition[];

  // Provider Manifest / Payload
  manifestTemplate?: {
    type: "yaml" | "json";
    filename: string;
    content: string;
  };

  // Composio BYOC Config
  composioConfig: {
    app: string;
    auth_mode: "OAUTH2";
    authorization_url: string;
    token_url: string;
    default_redirect_uri: string;
    recommended_scopes: string[];
    sample_sdk_python: string;
    sample_sdk_typescript: string;
  };

  // Evidence Verification
  evidence: {
    docCitations: string[];
    testedObservations: string[];
    uncertainties: string[];
  };
}

export const APPS_DATABASE: AppGuide[] = [
  {
    id: "github",
    name: "GitHub",
    slug: "github",
    category: "Developer Tools",
    logo: "https://github.githubassets.com/favicons/favicon.svg",
    developerPortalUrl: "https://github.com/settings/developers",
    docsUrl: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps",
    frictionScore: 1.0,
    setupTimeMinutes: 8,
    approvalWaitDays: 0,
    financialCost: "$0 (Free)",
    composioManagedAvailable: true,
    manifestSupported: true,
    pkceRequired: false,
    reviewRequiredForLaunch: false,
    reviewType: "None",
    summary: "Instant 0-day approval. GitHub OAuth apps require no central manual review to serve external users, but enterprise teams strongly prefer GitHub Apps for fine-grained repository permissions.",
    steps: [
      {
        id: 1,
        title: "Create OAuth App in Developer Settings",
        description: "Navigate to GitHub Settings -> Developer settings -> OAuth Apps -> New OAuth App.",
        actor: "human",
        portalUrl: "https://github.com/settings/applications/new"
      },
      {
        id: 2,
        title: "Configure Application Details & Redirect URI",
        description: "Set Application Name and Homepage URL. Set Authorization callback URL to Composio's callback.",
        actor: "hybrid",
        codeSnippet: "https://backend.composio.dev/api/v1/auth-apps/add"
      },
      {
        id: 3,
        title: "Generate Client Secret",
        description: "Click 'Generate a new client secret'. Store it immediately; GitHub will never show it again.",
        actor: "human"
      },
      {
        id: 4,
        title: "Export to Composio Auth Config",
        description: "Add Client ID and Client Secret into your Composio Auth Config or SDK.",
        actor: "agent"
      }
    ],
    agentCanDo: [
      "Generate complete Composio Auth Config JSON payload",
      "Format exact redirect callback URLs",
      "Validate least-privilege repository scopes for agent tools"
    ],
    humanMustDo: [
      "Click through GitHub Developer settings with GitHub account",
      "Copy client secret on generation",
      "Authorize organization access if testing on corporate repos"
    ],
    gotchas: [
      {
        title: "OAuth App vs. GitHub App Confusion",
        severity: "warning",
        description: "Traditional GitHub OAuth apps grant broad account-wide access (e.g. 'repo' scope grants read/write to ALL private repositories). For enterprise clients, use GitHub Apps instead to scope access to specific repositories.",
        evidenceType: "tested_reality"
      },
      {
        title: "Organization Access Restrictions",
        severity: "tip",
        description: "If an end-user belongs to an enterprise org with third-party app restrictions enabled, their org admin must explicitly approve your app before your agent can read org repositories.",
        evidenceType: "tested_reality"
      }
    ],
    scopes: [
      {
        name: "repo",
        description: "Full control of private repositories (code, commits, issues, PRs)",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["GITHUB_CREATE_PULL_REQUEST", "GITHUB_STAR_A_REPO", "GITHUB_CREATE_ISSUE"]
      },
      {
        name: "read:user",
        description: "Read all user profile data",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["GITHUB_GET_USER"]
      },
      {
        name: "user:email",
        description: "Access user email addresses (read-only)",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["GITHUB_GET_USER_EMAIL"]
      }
    ],
    composioConfig: {
      app: "github",
      auth_mode: "OAUTH2",
      authorization_url: "https://github.com/login/oauth/authorize",
      token_url: "https://github.com/login/oauth/access_token",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: ["repo", "read:user", "user:email"],
      sample_sdk_python: `from composio import Composio, App

composio = Composio()
# Register custom auth config for GitHub
auth_config = composio.auth_configs.create(
    app="github",
    credentials={
        "client_id": "YOUR_GITHUB_CLIENT_ID",
        "client_secret": "YOUR_GITHUB_CLIENT_SECRET"
    }
)

# Connect end-user account
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Send user to:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "github",
  credentials: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps",
        "https://docs.github.com/en/apps/oauth-apps/maintaining-oauth-apps/modifying-an-oauth-app"
      ],
      testedObservations: [
        "Instant creation without verification queue.",
        "Tokens do not expire by default unless user revokes or enterprise enables token expiration."
      ],
      uncertainties: [
        "GitHub is gradually pushing developers toward GitHub Apps; OAuth apps may receive fine-grained scope restrictions in the future."
      ]
    }
  },
  {
    id: "slack",
    name: "Slack",
    slug: "slack",
    category: "Communication",
    logo: "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
    developerPortalUrl: "https://api.slack.com/apps",
    docsUrl: "https://api.slack.com/authentication/oauth-v2",
    frictionScore: 2.0,
    setupTimeMinutes: 12,
    approvalWaitDays: 0,
    financialCost: "$0 (Free)",
    composioManagedAvailable: true,
    manifestSupported: true,
    pkceRequired: false,
    reviewRequiredForLaunch: false,
    reviewType: "Workspace Admin Only",
    summary: "Fast setup accelerated by Slack App Manifests. Public distribution across any workspace can be activated immediately without submitting to the Slack App Directory.",
    steps: [
      {
        id: 1,
        title: "Create App from Manifest (3 Seconds)",
        description: "Go to Slack API -> Create New App -> From an app manifest. Paste the auto-generated YAML manifest below to configure all scopes and redirect URLs instantly.",
        actor: "hybrid",
        portalUrl: "https://api.slack.com/apps?new_app=1"
      },
      {
        id: 2,
        title: "Retrieve Client Credentials",
        description: "Go to Basic Information -> App Credentials. Copy Client ID and Client Secret.",
        actor: "human"
      },
      {
        id: 3,
        title: "Enable Public Distribution (No Directory Review Required)",
        description: "Under 'Manage Distribution', click 'Activate Public Distribution'. This allows users from ANY external Slack workspace to authenticate without going through the 2-week App Directory review.",
        actor: "human",
        gotchaWarning: "Do NOT click 'Submit to App Directory' unless you want your app featured publicly. Public distribution alone is sufficient for external users."
      },
      {
        id: 4,
        title: "Export to Composio",
        description: "Save credentials in Composio BYOC Auth Config.",
        actor: "agent"
      }
    ],
    agentCanDo: [
      "Generate complete Slack App Manifest (YAML/JSON) with exact scopes",
      "Inject Composio OAuth redirect URIs into manifest",
      "Pre-configure bot event subscriptions and slash commands"
    ],
    humanMustDo: [
      "Paste manifest into Slack API modal",
      "Toggle 'Activate Public Distribution' switch",
      "Install app to testing workspace for first verification"
    ],
    gotchas: [
      {
        title: "Bot Token vs. User Token Scope Confusion",
        severity: "critical",
        description: "Slack distinguishes between Bot Scopes (`chat:write`) and User Scopes (`chat:write.customize`). AI agents sending messages on behalf of a user need User scopes; agents posting as a bot persona need Bot scopes. Mixing them up causes authorization loops.",
        evidenceType: "tested_reality"
      },
      {
        title: "App Directory vs. Public Distribution Illusion",
        severity: "tip",
        description: "Many developers believe they must pass Slack's 2-week App Directory review before external customers can connect. In reality, toggling 'Manage Distribution -> Public Distribution' instantly generates a shareable OAuth link for any workspace.",
        evidenceType: "tested_reality"
      }
    ],
    scopes: [
      {
        name: "chat:write",
        description: "Post messages in channels the bot belongs to",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["SLACK_SEND_MESSAGE", "SLACK_POST_CHAT_MESSAGE"]
      },
      {
        name: "channels:read",
        description: "View basic information about public channels",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["SLACK_LIST_CHANNELS"]
      },
      {
        name: "users:read",
        description: "View people in the workspace",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["SLACK_GET_USER_PRESENCE", "SLACK_LIST_USERS"]
      },
      {
        name: "channels:history",
        description: "View messages and other content in public channels",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["SLACK_FETCH_CONVERSATION_HISTORY"]
      }
    ],
    manifestTemplate: {
      type: "yaml",
      filename: "slack_manifest.yaml",
      content: `display_information:
  name: Composio Agent Companion
  description: AI Agent integration powered by Composio
  background_color: "#FF6600"
features:
  bot_user:
    display_name: AgentBot
    always_online: true
oauth_config:
  redirect_urls:
    - https://backend.composio.dev/api/v1/auth-apps/add
  scopes:
    bot:
      - chat:write
      - channels:read
      - users:read
      - channels:history
settings:
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false`
    },
    composioConfig: {
      app: "slack",
      auth_mode: "OAUTH2",
      authorization_url: "https://slack.com/oauth/v2/authorize",
      token_url: "https://slack.com/api/oauth.v2.access",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: ["chat:write", "channels:read", "users:read"],
      sample_sdk_python: `from composio import Composio

composio = Composio()
auth_config = composio.auth_configs.create(
    app="slack",
    credentials={
        "client_id": "YOUR_SLACK_CLIENT_ID",
        "client_secret": "YOUR_SLACK_CLIENT_SECRET"
    }
)
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Slack Connect URL:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "slack",
  credentials: {
    clientId: process.env.SLACK_CLIENT_ID!,
    clientSecret: process.env.SLACK_CLIENT_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://api.slack.com/authentication/oauth-v2",
        "https://api.slack.com/reference/manifests"
      ],
      testedObservations: [
        "Manifest creation takes under 30 seconds and eliminates manual form misconfigurations.",
        "Public distribution works immediately for external teams without directory submission."
      ],
      uncertainties: [
        "Enterprise Grid workspaces may have internal workspace policies requiring an admin approval per workspace."
      ]
    }
  },
  {
    id: "google-workspace",
    name: "Google Workspace (Gmail & Drive)",
    slug: "google-workspace",
    category: "Productivity",
    logo: "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png",
    developerPortalUrl: "https://console.cloud.google.com/apis/credentials",
    docsUrl: "https://developers.google.com/identity/protocols/oauth2",
    frictionScore: 4.8,
    setupTimeMinutes: 45,
    approvalWaitDays: 24, // 3 - 4 weeks
    financialCost: "$0 for basic; $3,000 - $15,000 if Restricted scopes trigger CASA Tier 2 Audit",
    composioManagedAvailable: true,
    manifestSupported: false,
    pkceRequired: false,
    reviewRequiredForLaunch: true,
    reviewType: "Google CASA Tier 2",
    summary: "The highest-friction OAuth ecosystem. Triggers mandatory multi-week human review, domain verification via Search Console, unlisted YouTube video demos, and potential third-party security audits (CASA) if requesting sensitive or restricted scopes.",
    steps: [
      {
        id: 1,
        title: "Create Project in Google Cloud Console",
        description: "Create a dedicated project in Google Cloud Console (e.g., 'Acme AI Agent Production').",
        actor: "human",
        portalUrl: "https://console.cloud.google.com/projectcreate"
      },
      {
        id: 2,
        title: "Configure OAuth Consent Screen",
        description: "Choose User Type: 'External' (for multi-tenant agents). Fill App Name, User Support Email, and Developer Contact Info.",
        actor: "human",
        portalUrl: "https://console.cloud.google.com/apis/credentials/consent"
      },
      {
        id: 3,
        title: "Scope Optimization (The CASA Bypass Decision)",
        description: "Choose ONLY Non-Sensitive or Sensitive scopes. If you select Restricted Scopes (`gmail.modify` or `gmail.readonly`), Google mandates a CASA Tier 2 audit costing up to $15,000.",
        actor: "hybrid",
        gotchaWarning: "Use `gmail.send` instead of `gmail.modify` whenever possible. `gmail.send` is sensitive, not restricted, saving weeks of review."
      },
      {
        id: 4,
        title: "Domain Verification in Google Search Console",
        description: "You must add DNS TXT records to prove ownership of the domain hosting your Privacy Policy and Terms of Service.",
        actor: "human",
        portalUrl: "https://search.google.com/search-console"
      },
      {
        id: 5,
        title: "Submit for App Verification & Screencast Video",
        description: "Record an unlisted YouTube video showing the OAuth client ID in the browser URL bar, the consent screen, and how your agent consumes data.",
        actor: "human"
      },
      {
        id: 6,
        title: "Generate OAuth Client ID & Export to Composio",
        description: "Create Credentials -> OAuth Client ID -> Web Application. Add Composio redirect URI.",
        actor: "agent",
        codeSnippet: "https://backend.composio.dev/api/v1/auth-apps/add"
      }
    ],
    agentCanDo: [
      "Calculate least-privilege scope set to prevent CASA Tier 2 audit trigger",
      "Draft Privacy Policy justification statements required during Google App Verification submission",
      "Generate complete Composio AuthConfig JSON with token endpoints"
    ],
    humanMustDo: [
      "Add DNS TXT records to Cloudflare / GoDaddy for Search Console verification",
      "Record and upload an unlisted YouTube video screencast demonstrating OAuth consent flow",
      "Respond to Google Trust & Safety reviewer emails during the 3-4 week review window",
      "Pay CASA assessor fee if restricted scopes are unavoidable"
    ],
    gotchas: [
      {
        title: "The 7-Day Token Expiration Trap (CRITICAL)",
        severity: "critical",
        description: "If your Google Cloud OAuth app publishing status is kept in 'Testing' mode, refresh tokens SILENTLY EXPIRE after 7 days! Your AI agent's background jobs will abruptly fail every week. You must push to 'In Production' to get non-expiring refresh tokens.",
        evidenceType: "tested_reality"
      },
      {
        title: "The Scope Penalty ($15,000 CASA Tier 2 Audit)",
        severity: "critical",
        description: "Selecting `https://mail.google.com/` or `gmail.modify` categorizes your app as Restricted. Google will require an external security firm (Bishop Fox, Leviathan) to audit your servers, costing $3,000 to $15,000 annually. Keep scopes to `gmail.send` to avoid this.",
        evidenceType: "tested_reality"
      },
      {
        title: "YouTube Video Review Rejections",
        severity: "warning",
        description: "Reviewers will reject submissions if the YouTube demo video does not explicitly show the Google Client ID visible in the browser address bar during the OAuth popup.",
        evidenceType: "unwritten_rule"
      }
    ],
    scopes: [
      {
        name: "https://www.googleapis.com/auth/gmail.send",
        description: "Send emails on behalf of the user",
        riskLevel: "medium",
        triggersReview: true,
        casaTier: 1, // Self-assessment only
        composioActions: ["GMAIL_SEND_EMAIL", "GMAIL_CREATE_DRAFT"]
      },
      {
        name: "https://www.googleapis.com/auth/gmail.readonly",
        description: "Read all email threads and messages (RESTRICTED)",
        riskLevel: "restricted",
        triggersReview: true,
        casaTier: 2, // Third-party audit ($3k - $15k)
        composioActions: ["GMAIL_FETCH_EMAILS", "GMAIL_GET_THREAD"]
      },
      {
        name: "https://www.googleapis.com/auth/gmail.modify",
        description: "Read, write, and delete emails (RESTRICTED)",
        riskLevel: "restricted",
        triggersReview: true,
        casaTier: 2,
        composioActions: ["GMAIL_DELETE_EMAIL", "GMAIL_CHANGE_LABEL"]
      },
      {
        name: "https://www.googleapis.com/auth/drive.file",
        description: "View and manage Google Drive files created by this app only (RECOMMENDED)",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["GOOGLEDRIVE_CREATE_FILE", "GOOGLEDRIVE_UPLOAD_FILE"]
      }
    ],
    composioConfig: {
      app: "gmail",
      auth_mode: "OAUTH2",
      authorization_url: "https://accounts.google.com/o/oauth2/v2/auth",
      token_url: "https://oauth2.googleapis.com/token",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/drive.file"
      ],
      sample_sdk_python: `from composio import Composio

composio = Composio()
auth_config = composio.auth_configs.create(
    app="gmail",
    credentials={
        "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        "client_secret": "YOUR_GOOGLE_CLIENT_SECRET"
    }
)
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Google Auth Link:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "gmail",
  credentials: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://developers.google.com/identity/protocols/oauth2/scopes",
        "https://support.google.com/cloud/answer/13463073 (CASA Security Assessment)"
      ],
      testedObservations: [
        "Testing mode refresh tokens expire at exactly 7 days (604,800 seconds).",
        "Domain verification requires exact root domain match in Search Console."
      ],
      uncertainties: [
        "Review queue times vary wildly between 10 business days and 6 weeks depending on reviewer backlogs."
      ]
    }
  },
  {
    id: "spotify",
    name: "Spotify",
    slug: "spotify",
    category: "Media & Content",
    logo: "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png",
    developerPortalUrl: "https://developer.spotify.com/dashboard",
    docsUrl: "https://developer.spotify.com/documentation/web-api/concepts/authorization",
    frictionScore: 3.5,
    setupTimeMinutes: 15,
    approvalWaitDays: 21,
    financialCost: "$0 (Free)",
    composioManagedAvailable: true,
    manifestSupported: false,
    pkceRequired: true,
    reviewRequiredForLaunch: true,
    reviewType: "Quota Extension Request",
    summary: "Fast initial prototype, but throttled by a hard 25-user development limit. Scaling beyond 25 beta testers requires an opaque 'Quota Extension Request' that takes 2 to 4 weeks.",
    steps: [
      {
        id: 1,
        title: "Create App in Spotify Developer Dashboard",
        description: "Log in with Spotify credentials and click 'Create App'. Set App Name and Website.",
        actor: "human",
        portalUrl: "https://developer.spotify.com/dashboard/create"
      },
      {
        id: 2,
        title: "Configure Redirect URIs",
        description: "Add Composio redirect URI in App Settings.",
        actor: "hybrid",
        codeSnippet: "https://backend.composio.dev/api/v1/auth-apps/add"
      },
      {
        id: 3,
        title: "Manage Development User Whitelist",
        description: "Manually add the Spotify email addresses of your team and beta testers (up to 25 accounts).",
        actor: "human",
        gotchaWarning: "Only these 25 explicitly listed emails can log in until Spotify approves your Quota Extension."
      },
      {
        id: 4,
        title: "Submit Quota Extension for Production",
        description: "Submit request with app description, commercial status, and how user data is stored.",
        actor: "human"
      }
    ],
    agentCanDo: [
      "Generate PKCE authorization challenge & token exchange payload",
      "Draft Spotify commercial justification submission",
      "Format Composio AuthConfig JSON"
    ],
    humanMustDo: [
      "Manually invite up to 25 tester emails in Spotify Dashboard",
      "Submit Quota Extension form explaining agent use case",
      "Accept Spotify Developer Terms of Service"
    ],
    gotchas: [
      {
        title: "The 25-User Hard Quota Gate",
        severity: "critical",
        description: "In Development mode, Spotify blocks any user whose email is not manually entered in the Developer Dashboard User Management tab. User #26 receives an immediate `User not registered on developer dashboard` error.",
        evidenceType: "tested_reality"
      },
      {
        title: "Rejection of General AI Agents",
        severity: "warning",
        description: "Spotify frequently rejects Quota Extensions for generic AI bots citing 'unclear value proposition' or audio stream scraping concerns. Frame your submission around playlist curation or track discovery.",
        evidenceType: "community_consensus"
      }
    ],
    scopes: [
      {
        name: "user-read-playback-state",
        description: "Read the current playback state and currently playing song",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["SPOTIFY_GET_PLAYBACK_STATE"]
      },
      {
        name: "user-modify-playback-state",
        description: "Control playback (play, pause, skip, queue)",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["SPOTIFY_PLAY_TRACK", "SPOTIFY_PAUSE_TRACK", "SPOTIFY_QUEUE_TRACK"]
      },
      {
        name: "playlist-modify-public",
        description: "Create and edit public playlists",
        riskLevel: "medium",
        triggersReview: true,
        composioActions: ["SPOTIFY_CREATE_PLAYLIST", "SPOTIFY_ADD_TO_PLAYLIST"]
      }
    ],
    composioConfig: {
      app: "spotify",
      auth_mode: "OAUTH2",
      authorization_url: "https://accounts.spotify.com/authorize",
      token_url: "https://accounts.spotify.com/api/token",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: [
        "user-read-playback-state",
        "user-modify-playback-state",
        "playlist-modify-public"
      ],
      sample_sdk_python: `from composio import Composio

composio = Composio()
auth_config = composio.auth_configs.create(
    app="spotify",
    credentials={
        "client_id": "YOUR_SPOTIFY_CLIENT_ID",
        "client_secret": "YOUR_SPOTIFY_CLIENT_SECRET"
    }
)
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Spotify Connect URL:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "spotify",
  credentials: {
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://developer.spotify.com/documentation/web-api/concepts/quota-modes"
      ],
      testedObservations: [
        "User 26 immediately fails with 403 Forbidden without quota extension approval."
      ],
      uncertainties: [
        "Spotify quota extension approval turnaround varies between 14 to 30 days."
      ]
    }
  },
  {
    id: "linear",
    name: "Linear",
    slug: "linear",
    category: "Productivity",
    logo: "https://linear.app/favicon.ico",
    developerPortalUrl: "https://linear.app/settings/api",
    docsUrl: "https://developers.linear.app/docs/oauth/authentication",
    frictionScore: 1.8,
    setupTimeMinutes: 10,
    approvalWaitDays: 0,
    financialCost: "$0 (Free)",
    composioManagedAvailable: true,
    manifestSupported: false,
    pkceRequired: true,
    reviewRequiredForLaunch: false,
    reviewType: "None",
    summary: "Exceptionally developer-friendly. Instant internal workspace authorization, strict PKCE enforcement, and actor-scoped tokens with zero wait times for custom integrations.",
    steps: [
      {
        id: 1,
        title: "Create OAuth Application in Linear Settings",
        description: "Go to Linear Settings -> Workspace -> API -> OAuth Applications -> New Application.",
        actor: "human",
        portalUrl: "https://linear.app/settings/api/applications/new"
      },
      {
        id: 2,
        title: "Configure PKCE & Callback URL",
        description: "Enter App Name, Redirect URIs, and ensure PKCE is checked.",
        actor: "hybrid",
        codeSnippet: "https://backend.composio.dev/api/v1/auth-apps/add"
      },
      {
        id: 3,
        title: "Export to Composio",
        description: "Save credentials in Composio Auth Config.",
        actor: "agent"
      }
    ],
    agentCanDo: [
      "Validate SHA-256 PKCE challenge generation",
      "Generate Composio Auth Config JSON with actor scoping",
      "Map Linear issue actions to read/write scopes"
    ],
    humanMustDo: [
      "Create application inside Linear workspace settings",
      "Store client secret"
    ],
    gotchas: [
      {
        title: "Actor-Scoping (User vs App Tokens)",
        severity: "tip",
        description: "Linear supports actor scoping: actions can be attributed either to the user who authorized the app or to the application bot itself.",
        evidenceType: "tested_reality"
      }
    ],
    scopes: [
      {
        name: "read",
        description: "Read issues, projects, cycles, and comments",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["LINEAR_LIST_ISSUES", "LINEAR_GET_PROJECT"]
      },
      {
        name: "write",
        description: "Create, update, and close issues and comments",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["LINEAR_CREATE_ISSUE", "LINEAR_UPDATE_ISSUE"]
      },
      {
        name: "issues:create",
        description: "Fine-grained permission to create issues only",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["LINEAR_CREATE_ISSUE"]
      }
    ],
    composioConfig: {
      app: "linear",
      auth_mode: "OAUTH2",
      authorization_url: "https://linear.app/oauth/authorize",
      token_url: "https://api.linear.app/oauth/token",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: ["read", "write", "issues:create"],
      sample_sdk_python: `from composio import Composio

composio = Composio()
auth_config = composio.auth_configs.create(
    app="linear",
    credentials={
        "client_id": "YOUR_LINEAR_CLIENT_ID",
        "client_secret": "YOUR_LINEAR_CLIENT_SECRET"
    }
)
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Linear Connect Link:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "linear",
  credentials: {
    clientId: process.env.LINEAR_CLIENT_ID!,
    clientSecret: process.env.LINEAR_CLIENT_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://developers.linear.app/docs/oauth/authentication"
      ],
      testedObservations: [
        "PKCE code_challenge is strictly verified on token exchange.",
        "Instant token issuance with zero manual approval queues."
      ],
      uncertainties: [
        "Public integrations directory listing requires partner contact form."
      ]
    }
  },
  {
    id: "notion",
    name: "Notion",
    slug: "notion",
    category: "Productivity",
    logo: "https://www.notion.so/front-static/favicon.ico",
    developerPortalUrl: "https://www.notion.so/my-integrations",
    docsUrl: "https://developers.notion.com/docs/authorization",
    frictionScore: 2.2,
    setupTimeMinutes: 10,
    approvalWaitDays: 0,
    financialCost: "$0 (Free)",
    composioManagedAvailable: true,
    manifestSupported: false,
    pkceRequired: false,
    reviewRequiredForLaunch: false,
    reviewType: "None",
    summary: "Instant internal workspace access with zero wait times. Public integrations require developer portal distribution approval with a privacy policy and terms of service.",
    steps: [
      {
        id: 1,
        title: "Create Integration in Notion Developer Portal",
        description: "Go to Notion -> Settings & Members -> Connections -> Develop or visit notion.so/my-integrations.",
        actor: "human",
        portalUrl: "https://www.notion.so/my-integrations"
      },
      {
        id: 2,
        title: "Configure OAuth Settings & Redirect URI",
        description: "Under Distribution, toggle to Public Integration. Add Composio redirect URI.",
        actor: "hybrid",
        codeSnippet: "https://backend.composio.dev/api/v1/auth-apps/add"
      },
      {
        id: 3,
        title: "Export Client Credentials to Composio",
        description: "Copy OAuth Client ID and Client Secret into your Composio BYOC Auth Config.",
        actor: "agent"
      }
    ],
    agentCanDo: [
      "Validate redirect callback syntax",
      "Format Composio AuthConfig JSON",
      "Map Notion database and page actions to capabilities"
    ],
    humanMustDo: [
      "Create integration in personal or company Notion workspace",
      "Toggle Public Distribution in Notion portal",
      "Users must grant access to specific pages during OAuth popup"
    ],
    gotchas: [
      {
        title: "The Page-Level Permission Trap",
        severity: "critical",
        description: "Unlike platforms that grant broad workspace access, Notion users must explicitly select which pages/databases the integration can access during the OAuth consent popup. If the user doesn't check a page, the agent receives empty search results.",
        evidenceType: "tested_reality"
      }
    ],
    scopes: [
      {
        name: "read_content",
        description: "Read page and database content",
        riskLevel: "low",
        triggersReview: false,
        composioActions: ["NOTION_SEARCH", "NOTION_FETCH_PAGE"]
      },
      {
        name: "update_content",
        description: "Create and edit pages and databases",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["NOTION_CREATE_PAGE", "NOTION_UPDATE_PAGE"]
      }
    ],
    composioConfig: {
      app: "notion",
      auth_mode: "OAUTH2",
      authorization_url: "https://api.notion.com/v1/oauth/authorize",
      token_url: "https://api.notion.com/v1/oauth/token",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: ["read_content", "update_content"],
      sample_sdk_python: `from composio import Composio

composio = Composio()
auth_config = composio.auth_configs.create(
    app="notion",
    credentials={
        "client_id": "YOUR_NOTION_CLIENT_ID",
        "client_secret": "YOUR_NOTION_CLIENT_SECRET"
    }
)
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Notion Connect Link:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "notion",
  credentials: {
    clientId: process.env.NOTION_CLIENT_ID!,
    clientSecret: process.env.NOTION_CLIENT_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://developers.notion.com/docs/authorization"
      ],
      testedObservations: [
        "Page selection during OAuth popup restricts API visibility strictly to chosen parent pages.",
        "Internal integrations work with permanent bot tokens with zero wait time."
      ],
      uncertainties: [
        "Public directory listing requirements subject to Notion review team discretion."
      ]
    }
  },
  {
    id: "salesforce",
    name: "Salesforce",
    slug: "salesforce",
    category: "CRM & Sales",
    logo: "https://www.salesforce.com/favicon.ico",
    developerPortalUrl: "https://developer.salesforce.com",
    docsUrl: "https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm",
    frictionScore: 3.8,
    setupTimeMinutes: 25,
    approvalWaitDays: 0,
    financialCost: "$0 (Free with Developer Org)",
    composioManagedAvailable: true,
    manifestSupported: false,
    pkceRequired: true,
    reviewRequiredForLaunch: false,
    reviewType: "None",
    summary: "Enterprise Connected App architecture. Immediate developer org usage, but requires careful handling of cluster replication delays and IP relaxation policies.",
    steps: [
      {
        id: 1,
        title: "Create Connected App in Salesforce Setup",
        description: "Go to Setup -> App Manager -> New Connected App. Check 'Enable OAuth Settings'.",
        actor: "human",
        portalUrl: "https://login.salesforce.com"
      },
      {
        id: 2,
        title: "Configure Callback URL & OAuth Scopes",
        description: "Set Callback URL to Composio redirect URL. Select scopes: 'Access and manage your data (api)' and 'Perform requests at any time (refresh_token, offline_access)'.",
        actor: "hybrid",
        codeSnippet: "https://backend.composio.dev/api/v1/auth-apps/add"
      },
      {
        id: 3,
        title: "Configure IP Relaxation & Wait 10 Minutes",
        description: "Under Manage Connected Apps, set IP Relaxation to 'Relax IP restrictions' and wait 2 to 10 minutes for replication across Salesforce data centers.",
        actor: "human",
        gotchaWarning: "Do NOT attempt OAuth immediately after saving! Salesforce requires 2–10 minutes to propagate credentials globally."
      },
      {
        id: 4,
        title: "Export Consumer Key & Secret to Composio",
        description: "Copy Consumer Key (Client ID) and Consumer Secret into your Composio Auth Config.",
        actor: "agent"
      }
    ],
    agentCanDo: [
      "Validate redirect URI and PKCE code challenge parameters",
      "Format Composio AuthConfig payload with Salesforce instance URLs",
      "Map Salesforce CRM actions (lead, deal, contact) to least-privilege scopes"
    ],
    humanMustDo: [
      "Access Salesforce Setup menu with System Administrator permissions",
      "Set IP Relaxation policy to prevent silent auth blocks",
      "Wait out the global cluster replication delay"
    ],
    gotchas: [
      {
        title: "The 10-Minute Global Cluster Replication Lag",
        severity: "critical",
        description: "For 2 to 10 minutes after saving a Connected App, all OAuth requests fail with 'invalid_client_id' while Salesforce replicates credentials across clusters. Developers frequently waste hours debugging code that isn't broken.",
        evidenceType: "tested_reality"
      },
      {
        title: "IP Relaxation Policy Requirement",
        severity: "warning",
        description: "By default, Salesforce blocks OAuth requests from unexpected IP ranges. You must set 'IP Relaxation' to 'Relax IP restrictions' in the Connected App policies, or cloud-hosted agents will be blocked.",
        evidenceType: "tested_reality"
      }
    ],
    scopes: [
      {
        name: "api",
        description: "Access and manage user data via REST/SOAP APIs",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["SALESFORCE_CREATE_LEAD", "SALESFORCE_UPDATE_OPPORTUNITY", "SALESFORCE_QUERY"]
      },
      {
        name: "refresh_token",
        description: "Perform requests on your behalf at any time (offline access)",
        riskLevel: "medium",
        triggersReview: false,
        composioActions: ["SALESFORCE_OFFLINE_ACCESS"]
      }
    ],
    composioConfig: {
      app: "salesforce",
      auth_mode: "OAUTH2",
      authorization_url: "https://login.salesforce.com/services/oauth2/authorize",
      token_url: "https://login.salesforce.com/services/oauth2/token",
      default_redirect_uri: "https://backend.composio.dev/api/v1/auth-apps/add",
      recommended_scopes: ["api", "refresh_token"],
      sample_sdk_python: `from composio import Composio

composio = Composio()
auth_config = composio.auth_configs.create(
    app="salesforce",
    credentials={
        "client_id": "YOUR_SALESFORCE_CONSUMER_KEY",
        "client_secret": "YOUR_SALESFORCE_CONSUMER_SECRET"
    }
)
connection = composio.connected_accounts.link(
    user_uuid="user_001",
    auth_config_id=auth_config.id
)
print("Salesforce Auth Link:", connection.redirect_url)`,
      sample_sdk_typescript: `import { Composio } from "composio-core";

const composio = new Composio();
const authConfig = await composio.authConfigs.create({
  app: "salesforce",
  credentials: {
    clientId: process.env.SALESFORCE_CONSUMER_KEY!,
    clientSecret: process.env.SALESFORCE_CONSUMER_SECRET!,
  },
});

const connection = await composio.connectedAccounts.link({
  userUuid: "user_001",
  authConfigId: authConfig.id,
});
console.log("Connect Link:", connection.redirectUrl);`
    },
    evidence: {
      docCitations: [
        "https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm"
      ],
      testedObservations: [
        "Connected App creation takes between 2 to 10 minutes to propagate across clusters.",
        "Requires 'refresh_token' scope for persistent long-lived agent access."
      ],
      uncertainties: [
        "Enterprise AppExchange public distribution requires security review fee."
      ]
    }
  }
];
