import React from 'react';
import { Users, Crown, Clock, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type LiveUser = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isHost: boolean;
};

interface UserListItemProps {
    user: LiveUser;
    isHost?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, isHost = false }) => {
    const displayName = user.name === "null null" ? (isHost ? "Quiz Host" : "Anonymous User") : user.name;
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="flex items-center gap-4 py-4 px-4 hover:bg-gray-50/50 rounded-lg transition-colors min-w-0">
            <div className="relative flex-shrink-0">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-base font-semibold text-white">
                            {initials}
                        </span>
                    )}
                </div>
                {isHost && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <Crown className="h-4 w-4 text-yellow-800" />
                    </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <p className="text-base font-semibold text-gray-900 truncate">
                        {displayName}
                    </p>
                    {isHost && (
                        <Badge className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 border-yellow-300 flex-shrink-0">
                            Host
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                    {user.email}
                </p>
            </div>
        </div>
    );
};

interface WaitingScreenProps {
    liveUsers: Map<string, LiveUser>;
    quizStarted?: boolean;
    isHost?: boolean;
    start?: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
    liveUsers,
    quizStarted = false,
    isHost = false,
    start
}) => {
    const usersArray = Array.from(liveUsers.values()) as LiveUser[];
    const totalUsers = usersArray.length;

    if (!quizStarted) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Left Side - Controls/Status */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Session</h1>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Preparing to start</span>
                        </div>
                    </div>

                    <div className="flex-1 p-6">
                        {isHost ? (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className="h-5 w-5 text-blue-600" />
                                        <h3 className="font-semibold text-blue-900">You&apos;re the Host</h3>
                                    </div>
                                    <p className="text-sm text-blue-700 mb-4">
                                        Ready to start the quiz? All participants are waiting for you.
                                    </p>
                                    <Button
                                        onClick={start}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        size="lg"
                                    >
                                        <Play className="h-5 w-5 mr-2" />
                                        Start Quiz
                                    </Button>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Session Info</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Total Participants:</span>
                                            <span className="font-medium">{totalUsers}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <span className="text-yellow-600 font-medium">Waiting</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                        <h3 className="font-semibold text-yellow-900">Waiting for Host</h3>
                                    </div>
                                    <p className="text-sm text-yellow-700">
                                        The quiz will begin once the host starts the session. Please wait...
                                    </p>
                                </div>

                                <div className="text-center py-8">
                                    <div className="flex justify-center space-x-1 mb-4">
                                        <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"></div>
                                    </div>
                                    <p className="text-sm text-gray-600">Get ready to participate!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Live Session</span>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span>Connected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Large Live Participation */}
                <div className="flex-1 p-6">
                    <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="h-6 w-6 text-blue-600" />
                                    <span className="text-xl text-gray-900">Live Participants</span>
                                </div>
                                <Badge className="text-sm px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
                                    {totalUsers} Online
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 p-0 overflow-hidden">
                            <ScrollArea className="h-[calc(100vh-220px)]">
                                <div className="p-6">
                                    {usersArray.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                            {usersArray.map((user) => (
                                                <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                                    <UserListItem user={user} isHost={user.isHost} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-500 mb-2">No participants yet</h3>
                                            <p className="text-gray-400">Share the quiz link to invite others</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return null;
};

