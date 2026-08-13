import { Link } from 'react-router-dom';
import { User, Calendar, CheckSquare, List, Settings } from 'lucide-react';

export const Sidebar = () => {

    return (
        <section>
            <ul>
                <li><Link title='Account' to='/Account'><User /></Link></li>
                <li><Link title='Calendar' to='/Calendar'><Calendar /></Link></li>
                <li><Link title='Tasks' to='/Tasks'><CheckSquare /></Link></li>
                <li><Link title='Task Lists' to='/TaskLists'><List /></Link></li>
                <li><Link title='Settings' to='/Settings'><Settings /></Link></li>
            </ul>
        </section>
    );

};