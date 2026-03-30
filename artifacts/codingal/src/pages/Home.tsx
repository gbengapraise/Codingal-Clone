import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, Award, Smile, ArrowRight, PlayCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { openBookingModal } from "@/lib/events";
import { useState } from "react";

// --- Subcomponents for Sections ---

function Hero() {
  return (
    <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl opacity-50 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-secondary-foreground text-sm font-bold mb-6 border border-orange-200 text-orange-600">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span>Rated 4.8/5 by 10,000+ parents</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Learn Coding <br />
              <span className="text-gradient relative">
                from the Best
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Empower your child with 21st-century skills. Join our live 1:1 coding classes designed by experts to make learning fun and effective.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={openBookingModal}
                className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Book a Free Trial Class
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 rounded-full bg-white text-gray-800 font-bold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5 text-secondary" />
                Watch Video
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm font-semibold text-gray-500">
              <div className="flex -space-x-3">
                {/* Parents avatars */}
                {/* landing page hero parents */}
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white" alt="Parent" />
                {/* landing page hero parents */}
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white" alt="Parent" />
                {/* landing page hero parents */}
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white" alt="Parent" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold">+10k</div>
              </div>
              <p>Trusted by parents worldwide</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-kid-coding.png`} 
                alt="Kid coding happily" 
                className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Recognized by</p>
                  <p className="text-lg font-display font-bold text-gray-900">STEM.org</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Live Classes</p>
                  <p className="text-lg font-display font-bold text-gray-900">1-on-1 Sessions</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: "Happy Students", value: "45,000+" },
    { label: "Expert Teachers", value: "800+" },
    { label: "Countries", value: "20+" },
    { label: "Coding Projects", value: "1M+" },
  ];

  return (
    <section className="py-12 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
          {stats.map((stat, i) => (
            <div key={i} className="text-center px-4">
              <h3 className="text-3xl md:text-4xl font-display font-black text-primary mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyPraiseCodingAcademy() {
  const features = [
    {
      icon: <Video className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
      title: "Live 1:1 Classes",
      desc: "Personalized attention ensuring your child learns at their own pace with direct teacher interaction."
    },
    {
      icon: <Star className="w-8 h-8 text-white" />,
      color: "bg-secondary",
      title: "Expert Teachers",
      desc: "Top 1% of computer science teachers carefully vetted and trained to teach kids."
    },
    {
      icon: <Smile className="w-8 h-8 text-white" />,
      color: "bg-primary",
      title: "Fun Curriculum",
      desc: "Project-based learning where kids build actual games, apps, and websites they can show off."
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      color: "bg-green-500",
      title: "STEM.org Certified",
      desc: "Curriculum aligned with international standards and certified by leading STEM organizations."
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Why Parents Choose Praise Coding Academy</h2>
          <p className="text-xl text-gray-600">We don't just teach code. We teach logical thinking, problem-solving, and creativity.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-6 shadow-md`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularCourses() {
  const courses = [
    {
      title: "Scratch Programming",
      image: "scratch-course.png",
      ages: "Grade 1-4",
      level: "Beginner",
      desc: "Learn logic using colorful blocks."
    },
    {
      title: "Python for Kids",
      image: "python-course.png",
      ages: "Grade 5-8",
      level: "Intermediate",
      desc: "Build real text-based applications."
    },
    {
      title: "Web Development",
      image: "web-dev-course.png",
      ages: "Grade 7-12",
      level: "Advanced",
      desc: "Create responsive interactive websites."
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Popular Courses</h2>
            <p className="text-xl text-gray-600">Find the perfect starting point for your child's coding journey.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/courses'}
            className="text-primary font-bold text-lg hover:text-primary/80 flex items-center gap-2 group"
          >
            View All Courses
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col group hover:-translate-y-2 transition-all duration-300">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                <img 
                  src={`${import.meta.env.BASE_URL}images/${course.image}`} 
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-sm font-bold text-gray-800">
                    {course.ages}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-sm font-bold text-primary">
                    {course.level}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow">{course.desc}</p>
                <button 
                  onClick={openBookingModal}
                  className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-800 font-bold hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  Book Free Trial
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Book a Free Class",
      desc: "Pick a convenient time slot for your child's 1-on-1 trial session.",
    },
    {
      num: "02",
      title: "Attend the Trial",
      desc: "Your child builds their first coding project with an expert teacher.",
    },
    {
      num: "03",
      title: "Enroll & Learn",
      desc: "Choose a curriculum track and start the journey to mastery.",
    }
  ];

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-6">How It Works</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">Start your coding journey in 3 simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-white/20" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-primary text-3xl font-display font-black mb-8 shadow-xl">
                {step.num}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed px-4">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={openBookingModal}
            className="px-10 py-5 rounded-full bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Start Step 1 Now
          </button>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Parent of 8yr old",
      content: "Praise Coding Academy transformed my son's screen time into learning time. He built his own game in just 3 weeks and couldn't be prouder!",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Parent of 12yr old",
      content: "The 1-on-1 format is incredibly effective. The teacher is patient and adapts to exactly what my daughter needs. Highly recommended.",
      img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop"
    },
    {
      name: "Emma Thompson",
      role: "Parent of 10yr old",
      content: "Best investment in my child's education. The curriculum is structured yet flexible enough to follow his interests in Roblox.",
      img: "https://images.unsplash.com/photo-1580894732444-8ecded790047?w=150&h=150&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-display font-bold text-center text-gray-900 mb-16">Loved by Parents & Kids</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-3xl relative">
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-gray-700 italic mb-8 text-lg">"{r.content}"</p>
              <div className="flex items-center gap-4">
                {/* landing page testimonial portrait */}
                <img src={r.img} alt={r.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">{r.name}</h4>
                  <p className="text-sm text-gray-500">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  const faqs = [
    { q: "What do I need for the trial class?", a: "Just a laptop/computer with an internet connection, webcam, and a modern browser (Chrome preferred). No prior coding experience is required!" },
    { q: "How are the classes scheduled?", a: "Classes are completely flexible. You can choose the days and times that work best for your child's schedule directly from our parent portal." },
    { q: "What if my child misses a class?", a: "Since it's 1-on-1, you can simply reschedule the class up to 2 hours before it begins without losing any credits." },
    { q: "Do you provide certificates?", a: "Yes! Students receive verified certificates upon completion of each module, which are great for school portfolios." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-display font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${openIdx === i ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-lg text-gray-900"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIdx === i ? 'rotate-180 text-primary' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <WhyPraiseCodingAcademy />
      <PopularCourses />
      <HowItWorks />
      <Testimonials />
      <FAQs />
    </Layout>
  );
}
