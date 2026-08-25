import { Link } from 'react-router-dom';
import { User, Calendar, CheckSquare, List, Settings, Grid2X2 } from 'lucide-react';

export const Sidebar = () => {

    const id = localStorage.getItem('userId');

    return (
        <section
            className="flex flex-col h-screen w-16 bg-gray-800 items-center py-4 gap-6 sticky top-0">
            <ul className="flex flex-col gap-6">
                <li>
                    <Link title='Account' to={`/users/${id}`} className="text-white hover:text-blue-400">
                        <User />
                    </Link>
                </li>
                <li>
                    <Link title='Calendar' to='/calendar' className="text-white hover:text-blue-400">
                        <Calendar />
                    </Link>
                </li>
                <li>
                    <Link title='Tasks' to='/tasks' className="text-white hover:text-blue-400">
                        <CheckSquare />
                    </Link>
                </li>
                <li>
                    <Link title='Eisenhower Matrix' to='/tasks/eisenhowermatrix' className="text-white hover:text-blue-400">
                        <Grid2X2 />
                    </Link>
                </li>
                <li>
                    <Link title='Task Lists' to='/tasklists' className="text-white hover:text-blue-400">
                        <List />
                    </Link>
                </li>
                <li>
                    <Link title='Settings' to='/settings' className="text-white hover:text-blue-400">
                        <Settings />
                    </Link>
                </li>
            </ul>
        </section>
    );

};