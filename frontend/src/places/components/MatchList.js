import React from 'react';

import LiveMatchCard from './LiveMatchCard';
import UpcomingMatchCard from './UpcomingMatchCard';

const MatchList = ({ events, type, limit, onSubmit }) => {
    const filtered = events
        .filter((e) => (type === 'live' ? e.isLive : !e.isLive))
        .slice(0, limit);

    const Card = type === 'live' ? LiveMatchCard : UpcomingMatchCard;
    const wrapperClass = type === 'live' ? 'matches-list-live' : 'matches-list';

    return (
        <div className={wrapperClass}>
            {filtered.map((match, index) => (
                <Card key={index} match={match} onSubmit={onSubmit} />
            ))}
        </div>
    );
};

export default MatchList;
