import { extractUserFromRequest, requireRole, unauthorizedJson, forbiddenJson, checkDirection, validateDirection } from './rbac';
import { User, Role } from './types';

type Handler = (req: Request, user: User | null) => Promise<Response> | Promise<any> | any;

export function withAuth(handler: Handler, options?: {
    allowedRoles?: Role[];
    allowPublic?: boolean;
    requireSameDirection?: boolean;
    allowCrossDirection?: boolean;
}) {
    return async function (request: Request) {
        const user = await extractUserFromRequest(request);
        if (!user && !options?.allowPublic) return unauthorizedJson('authentication required');
        if (user && options?.allowedRoles && !requireRole(user, options.allowedRoles)) return forbiddenJson('role not allowed');
        // handler will perform any resource-level direction checks when needed
        const result = await handler(request, user);
        // If handler returned a NextResponse or Response object, return it directly
        return result;
    };
}

export { checkDirection, validateDirection };
