import { useEffect, useState } from "react";

import {
    User,
    Upload,
    FileText,
    Save,
    Image as ImageIcon,
    Plus,
    X,
} from "lucide-react";

import {
    getMyProfile,
    updateMyProfile,
} from "../../services/profileServices";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";


const Profile = () => {
    const [profile, setProfile] =
        useState(null);

    const [profilePicture, setProfilePicture] =
        useState(null);

    const [resume, setResume] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [formData, setFormData] =
        useState({
            headline: "",
            bio: "",
            phone: "",
            date_of_birth: "",
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            github: "",
            linkedin: "",
            portfolio: "",
            is_open_to_work: true,
        });


    /*
    |--------------------------------------------------------------------------
    | Load Profile
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getMyProfile();

            setProfile(data);

            setFormData({
                headline:
                    data.headline || "",

                bio:
                    data.bio || "",

                phone:
                    data.phone || "",

                date_of_birth:
                    data.date_of_birth || "",

                address:
                    data.address || "",

                city:
                    data.city || "",

                state:
                    data.state || "",

                country:
                    data.country || "",

                pincode:
                    data.pincode || "",

                skills:
                    Array.isArray(data.skills)
                        ? data.skills
                        : [],

                experience:
                    Array.isArray(data.experience)
                        ? data.experience
                        : [],

                education:
                    Array.isArray(data.education)
                        ? data.education
                        : [],

                certifications:
                    Array.isArray(
                        data.certifications
                    )
                        ? data.certifications
                        : [],

                github:
                    data.github || "",

                linkedin:
                    data.linkedin || "",

                portfolio:
                    data.portfolio || "",

                is_open_to_work:
                    data.is_open_to_work ?? true,
            });

        } catch (error) {
            console.error(
                "Failed to load profile:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Unable to load your profile. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Handle Normal Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );

        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Profile Picture Validation
    |--------------------------------------------------------------------------
    */

    const handleProfilePictureChange = (
        event
    ) => {
        const file =
            event.target.files?.[0] ||
            null;

        setError("");
        setSuccess("");

        if (!file) {
            setProfilePicture(null);
            return;
        }

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {
            setProfilePicture(null);
            event.target.value = "";

            setError(
                "Profile picture must be less than 5 MB."
            );

            return;
        }

        if (!file.type.startsWith("image/")) {
            setProfilePicture(null);
            event.target.value = "";

            setError(
                "Please select a valid image file."
            );

            return;
        }

        setProfilePicture(file);
    };


    /*
    |--------------------------------------------------------------------------
    | Resume Validation
    |--------------------------------------------------------------------------
    */

    const handleResumeChange = (
        event
    ) => {
        const file =
            event.target.files?.[0] ||
            null;

        setError("");
        setSuccess("");

        if (!file) {
            setResume(null);
            return;
        }

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {
            setResume(null);
            event.target.value = "";

            setError(
                "Resume must be less than 10 MB."
            );

            return;
        }

        const allowedExtensions = [
            ".pdf",
            ".doc",
            ".docx",
        ];

        const fileName =
            file.name.toLowerCase();

        const isValidExtension =
            allowedExtensions.some(
                (extension) =>
                    fileName.endsWith(
                        extension
                    )
            );

        if (!isValidExtension) {
            setResume(null);
            event.target.value = "";

            setError(
                "Only PDF, DOC and DOCX resume files are supported."
            );

            return;
        }

        setResume(file);
    };


    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    const [skillInput, setSkillInput] =
        useState("");


    const addSkill = () => {
        const skill =
            skillInput.trim();

        if (!skill) {
            return;
        }

        const exists =
            formData.skills.some(
                (item) =>
                    item.toLowerCase() ===
                    skill.toLowerCase()
            );

        if (exists) {
            setSkillInput("");
            return;
        }

        setFormData(
            (previous) => ({
                ...previous,

                skills: [
                    ...previous.skills,
                    skill,
                ],
            })
        );

        setSkillInput("");
        setSuccess("");
    };


    const removeSkill = (
        index
    ) => {
        setFormData(
            (previous) => ({
                ...previous,

                skills:
                    previous.skills.filter(
                        (_, itemIndex) =>
                            itemIndex !== index
                    ),
            })
        );

        setSuccess("");
    };


    const handleSkillKeyDown = (
        event
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSkill();
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Experience
    |--------------------------------------------------------------------------
    */

    const [experienceInput, setExperienceInput] =
        useState("");


    const addExperience = () => {
        const value =
            experienceInput.trim();

        if (!value) {
            return;
        }

        setFormData(
            (previous) => ({
                ...previous,

                experience: [
                    ...previous.experience,
                    value,
                ],
            })
        );

        setExperienceInput("");
        setSuccess("");
    };


    const removeExperience = (
        index
    ) => {
        setFormData(
            (previous) => ({
                ...previous,

                experience:
                    previous.experience.filter(
                        (_, itemIndex) =>
                            itemIndex !== index
                    ),
            })
        );

        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Education
    |--------------------------------------------------------------------------
    */

    const [educationInput, setEducationInput] =
        useState("");


    const addEducation = () => {
        const value =
            educationInput.trim();

        if (!value) {
            return;
        }

        setFormData(
            (previous) => ({
                ...previous,

                education: [
                    ...previous.education,
                    value,
                ],
            })
        );

        setEducationInput("");
        setSuccess("");
    };


    const removeEducation = (
        index
    ) => {
        setFormData(
            (previous) => ({
                ...previous,

                education:
                    previous.education.filter(
                        (_, itemIndex) =>
                            itemIndex !== index
                    ),
            })
        );

        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Certifications
    |--------------------------------------------------------------------------
    */

    const [certificationInput, setCertificationInput] =
        useState("");


    const addCertification = () => {
        const value =
            certificationInput.trim();

        if (!value) {
            return;
        }

        setFormData(
            (previous) => ({
                ...previous,

                certifications: [
                    ...previous.certifications,
                    value,
                ],
            })
        );

        setCertificationInput("");
        setSuccess("");
    };


    const removeCertification = (
        index
    ) => {
        setFormData(
            (previous) => ({
                ...previous,

                certifications:
                    previous.certifications.filter(
                        (_, itemIndex) =>
                            itemIndex !== index
                    ),
            })
        );

        setSuccess("");
    };


    /*
    |--------------------------------------------------------------------------
    | Save Profile
    |--------------------------------------------------------------------------
    */

    const handleSave = async (
        event
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const data =
                new FormData();


            Object.entries(
                formData
            ).forEach(
                ([key, value]) => {

                    if (
                        Array.isArray(value)
                    ) {
                        data.append(
                            key,
                            JSON.stringify(
                                value
                            )
                        );
                    } else {
                        data.append(
                            key,
                            value
                        );
                    }
                }
            );


            if (profilePicture) {
                data.append(
                    "profile_picture",
                    profilePicture
                );
            }


            if (resume) {
                data.append(
                    "resume",
                    resume
                );
            }


            const response =
                await updateMyProfile(
                    data
                );


            setProfile(
                response
            );

            setProfilePicture(
                null
            );

            setResume(
                null
            );

            setSuccess(
                "Profile updated successfully."
            );

            await loadProfile();

        } catch (error) {
            console.error(
                "Profile update failed:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Failed to update profile. Please try again."
            );

        } finally {
            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading your profile..."
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && !profile) {
        return (
            <ErrorMessage
                message={error}
                onRetry={
                    loadProfile
                }
            />
        );
    }


    if (!profile) {
        return (
            <ErrorMessage
                message="Profile could not be loaded."
                onRetry={
                    loadProfile
                }
            />
        );
    }


    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-4xl font-bold text-gray-900">
                    Profile
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your profile, resume and professional information.
                </p>

            </div>


            {/* Success */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl font-medium">
                    {success}
                </div>

            )}


            {/* Error */}

            {error && profile && (

                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl font-medium">
                    {error}
                </div>

            )}


            {/* Profile Completion */}

            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-lg">
                            Profile Completion
                        </p>

                        <h2 className="text-5xl font-bold mt-2">
                            {profile.profile_completion || 0}%
                        </h2>

                    </div>

                    <User
                        size={65}
                    />

                </div>


                <div className="mt-6 bg-white/20 rounded-full h-3">

                    <div
                        className="bg-white h-3 rounded-full transition-all duration-500"
                        style={{
                            width: `${Math.min(
                                100,
                                Math.max(
                                    0,
                                    profile.profile_completion || 0
                                )
                            )}%`,
                        }}
                    />

                </div>

            </div>


            <form
                onSubmit={
                    handleSave
                }
                className="bg-white rounded-3xl shadow-lg p-8 space-y-10"
            >

                {/* Profile Picture */}

                <section>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Profile Picture
                    </h2>

                    <div className="mt-5 flex flex-wrap items-center gap-6">

                        {profile.profile_picture ? (

                            <img
                                src={
                                    profile.profile_picture
                                }
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                            />

                        ) : (

                            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center">

                                <User
                                    size={45}
                                    className="text-blue-600"
                                />

                            </div>

                        )}


                        <label className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">

                            <Upload
                                size={20}
                            />

                            Select Picture

                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={
                                    handleProfilePictureChange
                                }
                            />

                        </label>


                        {profilePicture && (

                            <span className="text-sm text-gray-500 flex items-center gap-2">

                                <ImageIcon
                                    size={16}
                                />

                                {profilePicture.name}

                            </span>

                        )}

                    </div>


                    <p className="text-xs text-gray-400 mt-3">
                        Supported image formats • Maximum 5 MB
                    </p>

                </section>


                {/* Professional Information */}

                <section>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Professional Information
                    </h2>


                    <div className="grid md:grid-cols-2 gap-6">

                        <InputField
                            label="Headline"
                            name="headline"
                            value={
                                formData.headline
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Full Stack Python Developer"
                        />


                        <InputField
                            label="Phone"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="9876543210"
                        />

                    </div>


                    <div className="mt-6">

                        <label className="block font-medium mb-2">
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            value={
                                formData.bio
                            }
                            onChange={
                                handleChange
                            }
                            rows="5"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tell employers about yourself..."
                        />

                    </div>

                </section>


                {/* Personal Information */}

                <section>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Personal Information
                    </h2>

                    <InputField
                        label="Date of Birth"
                        type="date"
                        name="date_of_birth"
                        value={
                            formData.date_of_birth
                        }
                        onChange={
                            handleChange
                        }
                    />

                </section>


                {/* Location */}

                <section>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Location
                    </h2>


                    <div className="grid md:grid-cols-2 gap-6">

                        <InputField
                            label="Address"
                            name="address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Street / Area"
                        />

                        <InputField
                            label="City"
                            name="city"
                            value={
                                formData.city
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="City"
                        />

                        <InputField
                            label="State"
                            name="state"
                            value={
                                formData.state
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="State"
                        />

                        <InputField
                            label="Country"
                            name="country"
                            value={
                                formData.country
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Country"
                        />

                        <InputField
                            label="Pincode"
                            name="pincode"
                            value={
                                formData.pincode
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Pincode"
                        />

                    </div>

                </section>


                {/* Skills */}

                <ListEditor
                    title="Skills"
                    placeholder="e.g. Python, Django, React"
                    inputValue={
                        skillInput
                    }
                    setInputValue={
                        setSkillInput
                    }
                    items={
                        formData.skills
                    }
                    onAdd={
                        addSkill
                    }
                    onRemove={
                        removeSkill
                    }
                    onKeyDown={
                        handleSkillKeyDown
                    }
                    color="blue"
                />


                {/* Experience */}

                <ListEditor
                    title="Experience"
                    placeholder="e.g. Full Stack Developer Intern - ABC Technologies"
                    inputValue={
                        experienceInput
                    }
                    setInputValue={
                        setExperienceInput
                    }
                    items={
                        formData.experience
                    }
                    onAdd={
                        addExperience
                    }
                    onRemove={
                        removeExperience
                    }
                    color="green"
                />


                {/* Education */}

                <ListEditor
                    title="Education"
                    placeholder="e.g. B.E. Computer Science - XYZ College"
                    inputValue={
                        educationInput
                    }
                    setInputValue={
                        setEducationInput
                    }
                    items={
                        formData.education
                    }
                    onAdd={
                        addEducation
                    }
                    onRemove={
                        removeEducation
                    }
                    color="indigo"
                />


                {/* Certifications */}

                <ListEditor
                    title="Certifications"
                    placeholder="e.g. Python Programming Certification"
                    inputValue={
                        certificationInput
                    }
                    setInputValue={
                        setCertificationInput
                    }
                    items={
                        formData.certifications
                    }
                    onAdd={
                        addCertification
                    }
                    onRemove={
                        removeCertification
                    }
                    color="orange"
                />


                {/* Social Links */}

                <section>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Social Links
                    </h2>


                    <div className="space-y-4">

                        <InputField
                            label="GitHub"
                            type="url"
                            name="github"
                            value={
                                formData.github
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://github.com/username"
                        />

                        <InputField
                            label="LinkedIn"
                            type="url"
                            name="linkedin"
                            value={
                                formData.linkedin
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://linkedin.com/in/username"
                        />

                        <InputField
                            label="Portfolio"
                            type="url"
                            name="portfolio"
                            value={
                                formData.portfolio
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://yourportfolio.com"
                        />

                    </div>

                </section>


                {/* Resume */}

                <section>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Resume
                    </h2>


                    <div className="mt-5 flex flex-wrap items-center gap-5">

                        <label className="cursor-pointer bg-gray-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition">

                            <FileText
                                size={20}
                            />

                            Select Resume

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                hidden
                                onChange={
                                    handleResumeChange
                                }
                            />

                        </label>


                        {resume && (

                            <span className="text-sm text-gray-500 flex items-center gap-2">

                                <FileText
                                    size={16}
                                />

                                {resume.name}

                            </span>

                        )}


                        {!resume &&
                            profile.resume && (

                                <span className="text-green-600 font-medium">
                                    Resume already uploaded
                                </span>

                            )}

                    </div>


                    <p className="text-xs text-gray-400 mt-3">
                        Supported formats: PDF, DOC, DOCX • Maximum 10 MB
                    </p>

                </section>


                {/* Open To Work */}

                <div className="flex items-center gap-3">

                    <input
                        type="checkbox"
                        name="is_open_to_work"
                        checked={
                            formData.is_open_to_work
                        }
                        onChange={
                            handleChange
                        }
                        className="w-5 h-5"
                    />

                    <label className="font-medium">
                        I am open to work
                    </label>

                </div>


                {/* Save */}

                <button
                    type="submit"
                    disabled={
                        saving
                    }
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >

                    {saving ? (

                        <>

                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />

                            Saving Profile...

                        </>

                    ) : (

                        <>

                            <Save
                                size={22}
                            />

                            Save Profile

                        </>

                    )}

                </button>

            </form>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Input Field
|--------------------------------------------------------------------------
*/

const InputField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
}) => (

    <div>

        <label className="block font-medium mb-2">
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

    </div>
);


/*
|--------------------------------------------------------------------------
| List Editor
|--------------------------------------------------------------------------
*/

const ListEditor = ({
    title,
    placeholder,
    inputValue,
    setInputValue,
    items,
    onAdd,
    onRemove,
    onKeyDown,
    color = "blue",
}) => {

    const colorClasses = {
        blue: {
            button: "bg-blue-600 hover:bg-blue-700",
            badge: "bg-blue-50 text-blue-700",
        },

        green: {
            button: "bg-green-600 hover:bg-green-700",
            badge: "bg-green-50 text-green-700",
        },

        indigo: {
            button: "bg-indigo-600 hover:bg-indigo-700",
            badge: "bg-indigo-50 text-indigo-700",
        },

        orange: {
            button: "bg-orange-600 hover:bg-orange-700",
            badge: "bg-orange-50 text-orange-700",
        },
    };


    const classes =
        colorClasses[color] ||
        colorClasses.blue;


    return (
        <section>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {title}
            </h2>


            <div className="flex flex-col sm:flex-row gap-3">

                <input
                    type="text"
                    value={
                        inputValue
                    }
                    onChange={(event) =>
                        setInputValue(
                            event.target.value
                        )
                    }
                    onKeyDown={
                        onKeyDown
                    }
                    placeholder={
                        placeholder
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />


                <button
                    type="button"
                    onClick={
                        onAdd
                    }
                    className={`px-5 py-3 rounded-xl text-white font-semibold ${classes.button}`}
                >

                    <span className="flex items-center justify-center gap-2">

                        <Plus
                            size={18}
                        />

                        Add

                    </span>

                </button>

            </div>


            {items.length > 0 && (

                <div className="flex flex-wrap gap-3 mt-5">

                    {items.map(
                        (item, index) => (

                            <div
                                key={`${item}-${index}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${classes.badge}`}
                            >

                                <span>
                                    {typeof item ===
                                        "string"
                                        ? item
                                        : JSON.stringify(
                                            item
                                        )}
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(
                                            index
                                        )
                                    }
                                    className="hover:opacity-60"
                                    title={`Remove ${title}`}
                                >

                                    <X
                                        size={16}
                                    />

                                </button>

                            </div>

                        )
                    )}

                </div>

            )}


            {items.length === 0 && (

                <p className="text-sm text-gray-400 mt-4">
                    No {title.toLowerCase()} added yet.
                </p>

            )}

        </section>
    );
};


export default Profile;