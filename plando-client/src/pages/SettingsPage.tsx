import { Link } from 'react-router-dom';

export const SettingsPage = () => {

    return (
        <section className="p-8">

            <div className="flex flex-col gap-4">
                <Link
                    className="flex-1 justify-center text-center"
                    title="Task Categories"
                    to='/TaskCategories'>
                    Task Categories
                </Link>
                <Link
                    className="flex-1 justify-center text-center"
                    title="Color Themes"
                    to='/ColorThemes'>
                    Color Themes
                </Link>
            </div>


        </section>
    );

};