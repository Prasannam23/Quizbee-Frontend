// ============================================================================
// RANK DISPLAY COMPONENT - Show student's current performance and ranking
// ============================================================================
// Features:
// - Animated gradient background
// - Current rank and total marks display
// - Performance indicators with icons
// - Responsive design
// ============================================================================

"use client";

import { RankDisplayProps } from "@/types/globaltypes";

export default function RankDisplay({ rank, totalMarks }: RankDisplayProps) {
    // Get rank-specific styling and icon
    const getRankStyling = () => {
        if (rank === 1) {
            return {
                gradient: "from-yellow-400 via-orange-400 to-red-400",
                icon: "👑",
                title: "Leading!",
                color: "text-yellow-100"
            };
        } else if (rank <= 3) {
            return {
                gradient: "from-purple-400 via-pink-400 to-purple-500",
                icon: "🏆",
                title: "Top 3!",
                color: "text-purple-100"
            };
        } else if (rank <= 10) {
            return {
                gradient: "from-blue-400 via-blue-500 to-blue-600",
                icon: "🎯",
                title: "Top 10!",
                color: "text-blue-100"
            };
        } else {
            return {
                gradient: "from-gray-400 via-gray-500 to-gray-600",
                icon: "📈",
                title: "Keep Going!",
                color: "text-gray-100"
            };
        }
    };

    const styling = getRankStyling();

    return (
        <div className={`bg-gradient-to-r ${styling.gradient} text-white rounded-lg p-6 mb-6 shadow-lg`}>
            {/* Header */}
            <div className="text-center mb-4">
                <div className="text-3xl mb-2">{styling.icon}</div>
                <h3 className="text-lg font-semibold">{styling.title}</h3>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
                {/* Current Rank */}
                <div className={`${styling.color}`}>
                    <div className="text-3xl font-bold mb-1">
                        #{rank}
                    </div>
                    <div className="text-sm opacity-90 font-medium">
                        Current Rank
                    </div>
                </div>

                {/* Total Marks */}
                <div className={`${styling.color}`}>
                    <div className="text-3xl font-bold mb-1">
                        {totalMarks}
                    </div>
                    <div className="text-sm opacity-90 font-medium">
                        Total Points
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 text-center">
                <div className={`text-xs ${styling.color} opacity-75`}>
                    {rank === 1
                        ? "🌟 You're in the lead! Keep it up!"
                        : rank <= 3
                            ? "🚀 So close to the top! Push harder!"
                            : rank <= 10
                                ? "💪 You're doing great! Keep pushing!"
                                : "📚 Every point counts! Keep learning!"
                    }
                </div>
            </div>
        </div>
    );
}
