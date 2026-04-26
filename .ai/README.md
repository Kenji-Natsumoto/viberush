# .ai/ — VibeRush AI コンテキスト

VibeRush プロジェクトに関わる AI エージェント（Claude Code / Codex / Lovable）が
参照する公開可能なコンテキストを格納する。

## 構造

```
.ai/
└─ memory/        # Claude Code 用メモリ（公開可能なもののみ）
```

## 公開・機密の境界

VibeRush リポジトリは PUBLIC（Building in Public 戦略）であるため、
組織機密・経営会議記録・個人情報は別 PRIVATE リポジトリ
[`Kenji-Natsumoto/claude-memory-viberush`](https://github.com/Kenji-Natsumoto/claude-memory-viberush)
で管理している。

Claude Code のメモリディレクトリ
（`~/.claude/projects/-Users-natsuken--01VibeRush/memory/`）には
両リポジトリへのシンボリックリンクが配置されており、AI からは透過的に 1 ディレクトリに見える。

## 関連

- 設計論文: [AI-Native Company のためのハーネス・インフラ設計 v0.1](https://github.com/Kenji-Natsumoto/AI-Company/blob/main/docs/ja/harness-infrastructure-v0.1.md)
- 決定記録: [#011 VibeRush メモリ 2 リポジトリ分割](https://github.com/Kenji-Natsumoto/AI-Company/blob/main/agents/decisions/2026-04-26_011_viberush-memory-2repo-split.md)
