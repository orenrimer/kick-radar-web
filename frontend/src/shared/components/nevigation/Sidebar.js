import React, { useContext, useEffect, useRef, useState, useMemo } from "react";

import EventItem from "../../../places/components/EventItem";
import AuthContext from "../contexts/AuthContext";

import "./Sidebar.css";

const hasUser = (list, userId) =>
    (list || []).some(
        (p) => (typeof p === 'object' ? p.id || p._id : p) === userId
    );

const SORT_OPTIONS = [
    { value: 'distance', label: 'Distance' },
    { value: 'popular', label: 'Popular' },
];

const Sidebar = ({
    events = [],
    scrollTo,
    distanceTo,
    onFocusEvent,
    onJoinRequest,
    onCancelParticipation,
    onDelete,
    onCancelRequest,
}) => {
    const auth = useContext(AuthContext);
    const cardRefs = useRef({});
    const [sortBy, setSortBy] = useState('distance');
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setSortOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || '';

    const sortedEvents = useMemo(() => {
        if (sortBy === 'popular') {
            return [...events].sort(
                (a, b) => (b.numOfParticipants || 0) - (a.numOfParticipants || 0)
            );
        }
        return [...events]
            .map((e) => ({
                ...e,
                distance: distanceTo ? distanceTo(e.coordinates) : Infinity,
            }))
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }, [events, sortBy, distanceTo]);

    useEffect(() => {
        if (!scrollTo?.id) return;
        const el = cardRefs.current[scrollTo.id];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [scrollTo]);

    return (
        <div className="sidebar-menu">
            <div className="sidebar-heading">
                <h2>Find games near you</h2>
                <p>Live matches and upcoming kick-offs around you</p>
            </div>
            <div className="sidebar-sort" ref={sortRef}>
                <span className="sidebar-sort__label">Sort by</span>
                <div className="sidebar-sort__control">
                    <button
                        type="button"
                        className="sidebar-sort__trigger"
                        onClick={() => setSortOpen((s) => !s)}
                    >
                        <span>{sortLabel}</span>
                        <i className="fa-solid fa-chevron-down" />
                    </button>
                    {sortOpen && (
                        <div className="sidebar-sort__menu">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`sidebar-sort__option ${
                                        opt.value === sortBy ? 'sidebar-sort__option--active' : ''
                                    }`}
                                    onClick={() => {
                                        setSortBy(opt.value);
                                        setSortOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {sortedEvents.length === 0 && (
                <p className="sidebar-empty">No events to show.</p>
            )}
            {sortedEvents.map((event) => {
                const id = event.id || event._id;
                const isActive = scrollTo?.id === id;
                return (
                    <div
                        key={id}
                        className={isActive ? 'sidebar-card sidebar-card--active' : 'sidebar-card'}
                        ref={(el) => {
                            cardRefs.current[id] = el;
                        }}
                        onClick={() => onFocusEvent && onFocusEvent(id)}
                    >
                        <EventItem
                            id={id}
                            self={event}
                            title={event.title}
                            description={event.description}
                            address={event.address}
                            coordinates={event.coordinates}
                            host={event.host}
                            numOfParticipants={event.numOfParticipants}
                            startTime={new Date(event.startTime).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                            isParticipated={hasUser(event.participants, auth.userId)}
                            isRequested={hasUser(event.pending, auth.userId)}
                            showFull
                            onJoinRequest={onJoinRequest}
                            onCancelParticipation={onCancelParticipation}
                            onDelete={onDelete}
                            onCancelRequest={onCancelRequest}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;
