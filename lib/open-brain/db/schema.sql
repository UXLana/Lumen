CREATE TABLE IF NOT EXISTS channels (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('dm', 'shared')),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  agent_id TEXT,
  member_agent_ids TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_message_at TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'agent', 'system')),
  agent_id TEXT,
  content TEXT NOT NULL DEFAULT '',
  mentions TEXT NOT NULL DEFAULT '[]',
  in_reply_to_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'complete'
    CHECK(status IN ('sending', 'streaming', 'complete', 'error')),
  needs_attention INTEGER NOT NULL DEFAULT 0,
  token_input INTEGER,
  token_output INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_channel
  ON messages(channel_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_attention
  ON messages(needs_attention) WHERE needs_attention = 1;

CREATE TABLE IF NOT EXISTS context (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  set_by TEXT NOT NULL,
  channel_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS swarm_tasks (
  id TEXT PRIMARY KEY,
  trigger_message_id TEXT NOT NULL,
  target_agent_id TEXT NOT NULL,
  source_agent_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK(status IN ('queued', 'running', 'complete', 'failed')),
  depth INTEGER NOT NULL DEFAULT 0,
  max_depth INTEGER NOT NULL DEFAULT 5,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_swarm_status
  ON swarm_tasks(status);

CREATE TABLE IF NOT EXISTS unread (
  channel_id TEXT PRIMARY KEY,
  unread_count INTEGER NOT NULL DEFAULT 0,
  has_attention INTEGER NOT NULL DEFAULT 0,
  last_read_message_id TEXT
);

CREATE TABLE IF NOT EXISTS agent_config_overrides (
  agent_id TEXT PRIMARY KEY,
  provider TEXT,
  model TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
