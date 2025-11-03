/** @jsxImportSource react */
import { Head, useForm } from '@inertiajs/react';

export default function Dashboard() {
    const { post } = useForm();

    const logout = (e) => {
        e.preventDefault();
        post('/cms/logout');
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-100">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <form onSubmit={logout}>
                            <button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                            <p className="text-gray-500 text-lg">Bem-vindo ao CMS!</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}