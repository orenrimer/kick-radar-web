import React from 'react';

const LiveMatchCard = ({ match, onSubmit }) => (
    <div className="match-card-live">
        <div className="match-card-live-top">
            <div className="live-badge">
                <span className="live-dot"></span> LIVE
            </div>
            <div className="live-minute"><p>{match.currMinute}'</p></div>
            <div className="match-action-live">
                <button onClick={() => onSubmit(match)}>Create event</button>
            </div>
        </div>
        <div className="match-card-live-teams">
            <div className="team">
                <img className="flag" src={match.homeTeamLogo} alt="home" />
                <span className="team">{match.homeTeamName}</span>
            </div>
            <div className="score">{match.score.home}</div>
        </div>
        <div className="match-card-live-teams">
            <div className="team">
                <img className="flag" src={match.awayTeamLogo} alt="away" />
                <span className="team">{match.awayTeamName}</span>
            </div>
            <div className="score" style={{ color: "var(--color-brand)" }}>{match.score.away}</div>
        </div>
    </div>
);

export default LiveMatchCard;
