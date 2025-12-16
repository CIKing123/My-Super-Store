import { createContext, useContext, useEffect, useState } from 'react';
<<<<<<< HEAD
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
=======
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

<<<<<<< HEAD
const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});
=======
const AuthContext = createContext<AuthContextType>({ session: null, user: null, loading: true, signOut: async () => { } });
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
<<<<<<< HEAD
        // Get initial session
=======
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

<<<<<<< HEAD
        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
=======
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
