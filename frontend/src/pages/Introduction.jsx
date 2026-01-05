import { LANGUAGES } from '../config';

const Introduction = ({ language }) => {
    const t = LANGUAGES[language];
    
    return (
        <section id="introduction-section" className="relative bg-white py-24">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-6 order-2 lg:order-1">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                            {t.intro_title} <span className="text-amber-600">{t.intro_project_name}</span> {t.intro_subtitle}
                        </h2>         
                        <div className="text-gray-600 leading-relaxed space-y-4 text-lg">
                            <p>
                                {t.intro_p1}
                            </p>
                            <p>
                                {t.intro_p2}
                            </p>
                            <p className="italic font-medium text-gray-800">
                                "{t.intro_quote}"
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[500px] order-1 lg:order-2">
                        <img
                            src="https://homevietnameserestaurants.com/wp-content/uploads/2023/09/HOME-SGN0611-2048x1366.jpg"
                            alt="Vietnamese Cuisine"
                            className="w-full h-full object-cover shadow-2xl rounded-sm"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Introduction;