"use client";

import { LeaderboardProps } from "@/types/globaltypes";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useEffect } from "react";

export default function Leaderboard({ users }: LeaderboardProps) {
    const { liveUsers } = useWebSocketStore();

    useEffect(() => {
        console.log("Live Users in Leaderboard:", liveUsers, users);
    }, [users, liveUsers]);

    // Get user details from liveUsers (Map)
    const getUserDetails = (userId: string) => {
        const liveUser = liveUsers.get(userId);
        return {
            name: liveUser?.name || "Unknown User",
            email: liveUser?.email || "",
            avatar: liveUser?.avatar || "",
        };
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="text-2xl mr-3">🏆</span>
                    Live Leaderboard
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Top {Math.min(users.length, 10)} participants
                </p>
            </div>

            {/* Leaderboard Entries */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((user, index) => {
                    const userDetails = getUserDetails(user.value);

                    return (
                        <div
                            key={user.value}
                            className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                {/* Left side - Rank and User */}
                                <div className="flex items-center flex-1 min-w-0">
                                    {/* Rank Number */}
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                                        {index + 1}
                                    </div>

                                    {/* User Avatar */}
                                    <div className="w-8 h-8 mr-3 flex-shrink-0">
                                        {userDetails.avatar ? (
                                            <img
                                                src={userDetails.avatar}
                                                alt={userDetails.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-bold">
                                                {userDetails.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="min-w-0 flex-1">
                                        <span className="font-semibold text-gray-800 truncate block">
                                            {userDetails.name}
                                        </span>
                                        {userDetails.email && (
                                            <span className="text-xs text-gray-500 truncate block">
                                                {userDetails.email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right side - Score */}
                                <div className="text-right ml-3">
                                    <div className="text-lg font-bold text-blue-600">
                                        {Math.round((user?.score || 0) * 100) / 100}

                                    </div>
                                    <div className="text-xs text-gray-500">
                                        points
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {users.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        No scores yet!
                    </h4>
                    <p className="text-gray-500 text-sm">
                        Be the first to answer and claim the top spot!
                    </p>
                </div>
            )}

            {/* Footer Stats */}
            {users.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{users.length} total participants</span>
                        <span>Updates live</span>
                    </div>
                </div>
            )}
        </div>
    );
}