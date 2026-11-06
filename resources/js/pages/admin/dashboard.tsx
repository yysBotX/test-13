import { Head, Link } from '@inertiajs/react';
import { BadgeCheck, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import admin from '@/routes/admin';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string | null;
};

export default function AdminDashboard({
    stats,
    recentUsers,
}: {
    stats: {
        totalUsers: number;
        admins: number;
        verifiedUsers: number;
    };
    recentUsers: AdminUser[];
}) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
        },
        {
            title: 'Admins',
            value: stats.admins,
            icon: ShieldCheck,
        },
        {
            title: 'Verified Users',
            value: stats.verifiedUsers,
            icon: BadgeCheck,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {statCards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between gap-2">
                                <CardDescription>
                                    {card.title}
                                </CardDescription>
                                <card.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold tracking-tight">
                                    {card.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <div className="grid gap-1.5">
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>
                                The five most recently registered accounts.
                            </CardDescription>
                        </div>
                        <Link
                            href={admin.users.index()}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-border">
                            {recentUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex items-center justify-between gap-4 py-3"
                                >
                                    <div className="grid min-w-0 gap-0.5">
                                        <span className="truncate text-sm font-medium">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={
                                            user.role === 'admin'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin.dashboard(),
        },
    ],
};
