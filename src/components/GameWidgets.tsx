import { useState } from "react";

export const Token = ({
  index,
  movable,
  onClick,
}: {
  index: number;
  movable: boolean;
  onClick: () => void;
}) => (
  <button className="tok-btn" disabled={!movable} onClick={onClick}>
    Token {index + 1} {movable ? "• movable" : ""}
  </button>
);

export const LudoBoard = ({
  tokens,
  movable,
  onMove,
}: {
  tokens: number[];
  movable: number[];
  onMove: (idx: number) => void;
}) => (
  <div className="panel">
    <div className="panel-hd">Board</div>
    <div className="panel-bd">
      {tokens.map((position, idx) => (
        <div key={idx}>
          <Token index={idx} movable={movable.includes(idx)} onClick={() => onMove(idx)} />
          <span> Pos: {position}</span>
        </div>
      ))}
    </div>
  </div>
);

export const DicePanel = ({
  canRoll,
  value,
  onRoll,
  secondsLeft,
}: {
  canRoll: boolean;
  value: number | null;
  onRoll: () => void;
  secondsLeft: number;
}) => (
  <div className="panel">
    <div className="panel-hd">Dice / Timer</div>
    <div className="panel-bd">
      <div className="die-number">{value ?? "-"}</div>
      <button className="roll-btn" disabled={!canRoll} onClick={onRoll}>Roll</button>
      <div>Timer: {secondsLeft}s</div>
    </div>
  </div>
);

export const PlayerCard = ({ player, isActive }: { player: any; isActive: boolean }) => (
  <div className={`player-card ${isActive ? "active" : ""}`}>
    <div className="p-name">{player.username} ({player.color}) {player.isAI ? "[AI]" : ""}</div>
    <div className="p-stats">Rank: {player.rank ?? "-"}</div>
  </div>
);

export const ChatBox = ({
  chatLog,
  onSend,
}: {
  chatLog: any[];
  onSend: (msg: string) => void;
}) => {
  const [message, setMessage] = useState("");
  return (
    <div className="panel">
      <div className="panel-hd">Live Chat</div>
      <div className="chat-window">
        <div className="chat-messages">
          {chatLog.map((entry, idx) => <div key={idx}>{entry.username}: {entry.message}</div>)}
        </div>
        <div className="chat-input-row">
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={() => { onSend(message); setMessage(""); }}>Send</button>
        </div>
      </div>
    </div>
  );
};

export const GameLog = ({ logs, ranks }: { logs: string[]; ranks: string[] }) => (
  <div className="panel">
    <div className="panel-hd">Game Log / Standings</div>
    <div className="panel-bd">
      {logs.slice(-10).map((l, idx) => <div key={idx}>{l}</div>)}
      <hr />
      {ranks.map((r, idx) => <div key={idx}>{r}</div>)}
    </div>
  </div>
);
