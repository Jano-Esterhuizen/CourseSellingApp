import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';




export default function AdminDashboard() {
    const { token, logout } = useAuth();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        price: '',
        instructor: '',
        category: '',
        thumbnailUrl: ''
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/admin/courseadmin/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setNewCourse((prev) => ({
                ...prev,
                thumbnailUrl: `/images/${res.data.fileName}`,
            }));
        } catch (err) {
            setError('Image upload failed');
            console.error(err);
        }
    };


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourses(response.data);
            } catch (err) {
                setError('Failed to load courses.');
            }
        };

        fetchCourses();
    }, [token]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!newCourse.thumbnailUrl) {
                        setError("Please upload a thumbnail image.");
                        return;
                    }

                    try {
                        await api.post('/admin/courseadmin', newCourse, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setNewCourse({
                            title: '',
                            description: '',
                            price: '',
                            instructor: '',
                            category: '',
                            thumbnailUrl: ''
                        });

                        // Reload course list
                        const updated = await api.get('/courses', {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setCourses(updated.data);
                    } catch (err) {
                        setError('Failed to add course');
                        console.error(err);
                    }
                }}
                className="mb-6 space-y-2 border p-4 rounded"
            >
                <h2 className="text-lg font-semibold">Add New Course</h2>
                <input
                    className="w-full border p-2"
                    placeholder="Title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
                <input
                    className="w-full border p-2"
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
                <input
                    className="w-full border p-2"
                    placeholder="Price"
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                />
                <input
                    className="w-full border p-2"
                    placeholder="Instructor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                />
                <input
                    className="w-full border p-2"
                    placeholder="Category"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                />
                <input
                    type="file"
                    className="w-full border p-2"
                    onChange={handleFileUpload}
                />

                <p className="text-sm text-gray-500">Preview:</p>

                {/* Show preview if we have a thumbnailUrl */}
                {newCourse.thumbnailUrl && (
                    <img
                        src={`http://localhost:5025${newCourse.thumbnailUrl}`}
                        alt="Preview"
                        className="w-32 h-32 object-cover mt-2 rounded border"
                    />
                )}

                <button className="bg-green-600 text-white px-4 py-1 rounded" type="submit">
                    Add Course
                </button>
            </form>


            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Title</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Instructor</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Thumbnail</th>
                        <th className="p-2">Actions</th>


                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id} className="border-t">
                            {editingCourse?.id === course.id ? (
                                <>
                                    <td className="p-2">
                                        <input
                                            value={editingCourse.title}
                                            onChange={(e) =>
                                                setEditingCourse({ ...editingCourse, title: e.target.value })
                                            }
                                            className="border p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            value={editingCourse.description}
                                            onChange={(e) =>
                                                setEditingCourse({ ...editingCourse, description: e.target.value })
                                            }
                                            className="border p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            value={editingCourse.price}
                                            onChange={(e) =>
                                                setEditingCourse({ ...editingCourse, price: e.target.value })
                                            }
                                            className="border p-1 w-full"
                                            type="number"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            value={editingCourse.instructor}
                                            onChange={(e) =>
                                                setEditingCourse({ ...editingCourse, instructor: e.target.value })
                                            }
                                            className="border p-1 w-full"
                                            placeholder="Instructor"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            value={editingCourse.category}
                                            onChange={(e) =>
                                                setEditingCourse({ ...editingCourse, category: e.target.value })
                                            }
                                            className="border p-1 w-full"
                                            placeholder="Category"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            value={editingCourse.thumbnailUrl}
                                            onChange={(e) =>
                                                setEditingCourse({ ...editingCourse, thumbnailUrl: e.target.value })
                                            }
                                            className="border p-1 w-full"
                                            placeholder="Thumbnail URL"
                                        />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="p-2">{course.title}</td>
                                    <td className="p-2">{course.description}</td>
                                    <td className="p-2">${course.price}</td>
                                    <td className="p-2">{course.instructor}</td>
                                    <td className="p-2">{course.category}</td>
                                    <td className="p-2">
                                        <img
                                            src={`http://localhost:5025${course.thumbnailUrl.startsWith('/images') ? course.thumbnailUrl : `/images/${course.thumbnailUrl}`}`}
                                            alt="thumb"
                                            className="w-12 h-12 object-cover rounded"
                                        />

                                    </td>

                                </>
                            )}
                            <td className="p-2">
                                {editingCourse?.id === course.id ? (
                                    <>
                                        <button
                                            className="text-green-600 mr-2"
                                            onClick={async () => {
                                                try {
                                                    await api.put(`/admin/courseadmin/${editingCourse.id}`, editingCourse, {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    });
                                                    setEditingCourse(null);
                                                    const updated = await api.get('/courses', {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    });
                                                    setCourses(updated.data);
                                                } catch (err) {
                                                    setError('Failed to update course');
                                                    console.error(err);
                                                }
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button className="text-gray-600" onClick={() => setEditingCourse(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="text-blue-600 mr-2" onClick={() => setEditingCourse(course)}>
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600"
                                            onClick={async () => {
                                                const confirmDelete = confirm(`Delete "${course.title}"?`);
                                                if (!confirmDelete) return;

                                                try {
                                                    await api.delete(`/admin/courseadmin/${course.id}`, {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    });
                                                    const updated = await api.get('/courses', {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    });
                                                    setCourses(updated.data);
                                                } catch (err) {
                                                    setError('Failed to delete course');
                                                    console.error(err);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
