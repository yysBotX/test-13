import { Head, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import admin from '@/routes/admin';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    email_verified_at: string | null;
    created_at: string | null;
};

type PaginatedUsers = {
    data: ManagedUser[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export default function UsersIndex({
    users,
    filters,
}: {
    users: PaginatedUsers;
    filters: {
        search: string;
    };
}) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search);
    const [roleError, setRoleError] = useState<string | null>(null);

    function applySearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            admin.users.index.url({
                query: { search: search || undefined },
            }),
            {},
            { preserveState: true, replace: true },
        );
    }

    function changeRole(user: ManagedUser, role: string) {
        setRoleError(null);

        router.patch(
            admin.users.update.url(user.id),
            { role },
            {
                preserveScroll: true,
                onError: (errors) => {
                    setRoleError(errors.role ?? 'Failed to update role.');
                },
            },
        );
    }

    function goToPage(page: number) {
        router.get(
            admin.users.index.url({
                query: {
                    page,
                    search: filters.search || undefined,
                },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid gap-1">
                        <h1 className="text-xl font-semibold tracking-tight">
                            User Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            View accounts and manage their roles.
                        </p>
                    </div>

                    <form
                        onSubmit={applySearch}
                        className="flex w-full items-center gap-2 sm:w-auto"
                    >
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search name or email…"
                                className="pl-9"
                                aria-label="Search users"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                </div>

                {roleError && <InputError message={roleError} />}

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">
                                        Verified
                                    </th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                    <th className="px-4 py-3 font-medium">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const isSelf = user.id === auth.user.id;

                                        return (
                                            <tr
                                                key={user.id}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-3 font-medium whitespace-nowrap">
                                                    {user.name}
                                                    {isSelf && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2"
                                                        >
                                                            You
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {user.email_verified_at ? (
                                                        <Badge variant="secondary">
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            Unverified
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Select
                                                        value={user.role}
                                                        disabled={isSelf}
                                                        onValueChange={(role) =>
                                                            changeRole(user, role)
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            size="sm"
                                                            aria-label={`Role for ${user.name}`}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">
                                                                Admin
                                                            </SelectItem>
                                                            <SelectItem value="user">
                                                                User
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                    {user.created_at
                                                        ? new Date(
                                                              user.created_at,
                                                          ).toLocaleDateString()
                                                        : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>
                        {users.total === 0
                            ? 'No results'
                            : `Showing ${users.from}–${users.to} of ${users.total} users`}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={users.current_page <= 1}
                            onClick={() => goToPage(users.current_page - 1)}
                        >
                            Previous
                        </Button>
                        <span className="tabular-nums">
                            Page {users.current_page} of {users.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={users.current_page >= users.last_page}
                            onClick={() => goToPage(users.current_page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin.dashboard(),
        },
        {
            title: 'User Management',
            href: admin.users.index(),
        },
    ],
};
