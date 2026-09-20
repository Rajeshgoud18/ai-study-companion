export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
};

// Normalizes "ROLE_ADMIN" / "admin" / "ADMIN" -> "ADMIN"
export const normalizeRole = (role) => {
    if (!role) {
        return null;
    }

    return String(role).replace(/^ROLE_/i, "").toUpperCase();
};

export const isAdmin = (user) => normalizeRole(user?.role) === ROLES.ADMIN;

// Where a logged-in user should land
export const getHomePath = (user) => (isAdmin(user) ? "/admin" : "/home");