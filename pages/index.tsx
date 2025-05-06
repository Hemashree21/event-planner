
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu } from "lucide-react";

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface EventRSVP {
  userId: string;
  status: "going" | "maybe" | "declined";
}

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  createdBy: string;
  rsvps: EventRSVP[];
}

interface EventSuggestion {
  id: string;
  title: string;
  description: string;
  votes: string[];
}

// Mock Data
const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "u2",
    name: "Sarah Williams",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "u3",
    name: "Miguel Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: "u4",
    name: "Emma Chen",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: "u5",
    name: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "u6",
    name: "Priya Patel",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
  },
  {
    id: "u7",
    name: "Thomas Wright",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const currentUser = mockUsers[0];

// Generate events for the next 2 months
const generateEvents = (): Event[] => {
  const today = new Date();
  const events: Event[] = [];
  
  // Movie Night (upcoming soon)
  events.push({
    id: "e1",
    title: "Movie Night",
    description: "Let's watch the new Dune movie!",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 19, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 22, 0),
    location: "Alex's Place",
    createdBy: "u1",
    rsvps: [
      { userId: "u1", status: "going" },
      { userId: "u2", status: "going" },
      { userId: "u3", status: "maybe" },
      { userId: "u4", status: "going" },
      { userId: "u5", status: "declined" },
    ]
  });
  
  // Hiking Trip
  events.push({
    id: "e2",
    title: "Hiking Trip",
    description: "Day hike to Eagle Mountain. Bring water and snacks!",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 9, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 16, 0),
    location: "Eagle Mountain Trailhead",
    createdBy: "u3",
    rsvps: [
      { userId: "u1", status: "going" },
      { userId: "u3", status: "going" },
      { userId: "u6", status: "going" },
      { userId: "u7", status: "maybe" },
    ]
  });
  
  // Game Night
  events.push({
    id: "e3",
    title: "Board Game Night",
    description: "Bringing out Settlers of Catan and Ticket to Ride!",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 18, 30),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 23, 0),
    location: "Sarah's Apartment",
    createdBy: "u2",
    rsvps: [
      { userId: "u1", status: "going" },
      { userId: "u2", status: "going" },
      { userId: "u3", status: "going" },
      { userId: "u4", status: "going" },
      { userId: "u5", status: "going" },
      { userId: "u6", status: "maybe" },
      { userId: "u7", status: "going" },
    ]
  });
  
  // Birthday Dinner
  events.push({
    id: "e4",
    title: "Emma's Birthday Dinner",
    description: "Celebration at Italiano Restaurant. Gift optional!",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 19, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 22, 0),
    location: "Italiano Restaurant",
    createdBy: "u4",
    rsvps: [
      { userId: "u1", status: "going" },
      { userId: "u2", status: "going" },
      { userId: "u3", status: "going" },
      { userId: "u4", status: "going" },
      { userId: "u5", status: "going" },
      { userId: "u7", status: "going" },
    ]
  });
  
  // Beach Day
  events.push({
    id: "e5",
    title: "Beach Day",
    description: "Let's enjoy the sun and surf! Bring sunscreen.",
    startTime: new Date(today.getFullYear(), today.getMonth() + 1, 5, 11, 0),
    endTime: new Date(today.getFullYear(), today.getMonth() + 1, 5, 17, 0),
    location: "Sunset Beach",
    createdBy: "u6",
    rsvps: [
      { userId: "u1", status: "maybe" },
      { userId: "u2", status: "going" },
      { userId: "u3", status: "going" },
      { userId: "u4", status: "declined" },
      { userId: "u6", status: "going" },
    ]
  });

  // Concert 
  events.push({
    id: "e6",
    title: "Local Band Concert",
    description: "Supporting our friend's band at Downtown Bar",
    startTime: new Date(today.getFullYear(), today.getMonth() + 1, 12, 20, 0),
    endTime: new Date(today.getFullYear(), today.getMonth() + 1, 12, 23, 30),
    location: "Downtown Bar & Venue",
    createdBy: "u5",
    rsvps: [
      { userId: "u1", status: "going" },
      { userId: "u3", status: "going" },
      { userId: "u5", status: "going" },
      { userId: "u7", status: "maybe" },
    ]
  });
  
  return events;
};

const mockEventSuggestions: EventSuggestion[] = [
  {
    id: "s1",
    title: "Camping Weekend",
    description: "2-day camping trip at Lake Mountain",
    votes: ["u1", "u3", "u6"]
  },
  {
    id: "s2",
    title: "Cooking Class",
    description: "Italian cooking class at Culinary Center",
    votes: ["u2", "u4", "u5"]
  },
  {
    id: "s3",
    title: "Kayaking",
    description: "Half day kayaking trip on Cedar River",
    votes: ["u1", "u2", "u3", "u6", "u7"]
  },
  {
    id: "s4",
    title: "Escape Room",
    description: "Try the new escape room downtown",
    votes: ["u1", "u4", "u7"]
  }
];

// Activity data for chart
const activityData = [
  { month: 'Jan', events: 4, attendance: 78 },
  { month: 'Feb', events: 6, attendance: 85 },
  { month: 'Mar', events: 5, attendance: 90 },
  { month: 'Apr', events: 7, attendance: 81 },
  { month: 'May', events: 5, attendance: 88 },
  { month: 'Jun', events: 8, attendance: 90 },
];

// Testimonials for Home page
const testimonials = [
  {
    id: 1,
    name: "Lisa M.",
    role: "Event Organizer",
    content: "Group Planner has transformed how our hiking club plans trips. We've seen a 40% increase in attendance since we started using it!",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg"
  },
  {
    id: 2,
    name: "James K.",
    role: "Book Club Leader",
    content: "The voting feature is my favorite - it's so much easier to pick our next book when everyone can vote in one place.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Aisha T.",
    role: "Group Activity Coordinator",
    content: "We use Group Planner for our weekly game nights. The RSVP tracking saves me hours of messaging people individually.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

// Features for Home page
const features = [
  {
    title: "Interactive Calendar",
    description: "Visual calendar that makes it easy to see upcoming events at a glance. Add events with a simple click.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "RSVP Tracking",
    description: "See who's coming, who might attend, and who can't make it. No more spreadsheets or group texts.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    title: "Event Suggestions",
    description: "Allow everyone to suggest and vote on ideas for future events. Democratic planning that involves the whole group.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Activity Analytics",
    description: "Track participation trends and engagement over time. Understand what events are most popular with your group.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Reminders & Notifications",
    description: "Never miss an event with timely reminders. Everyone stays in the loop with upcoming event notifications.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
  {
    title: "Mobile Responsive",
    description: "Plan on the go with a fully responsive design that works on phones, tablets, and desktops.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }
];

// FAQ items for Home page
const faqItems = [
  {
    question: "How do I create a new event?",
    answer: "Click the 'New Event' button in the calendar view or at the top of the events list. Fill in the event details in the popup form, and click 'Create Event' to save it."
  },
  {
    question: "Can I suggest an event without setting a specific date?",
    answer: "Yes! Go to the Suggestions tab and click 'New Suggestion'. You can add your idea without committing to a specific date and time. Group members can vote on suggestions they like."
  },
  {
    question: "How do I change my RSVP status for an event?",
    answer: "Click on an event in the calendar or event list to open its details. At the bottom of the event modal, you'll see three buttons: 'Going', 'Maybe', and 'Can't Go'. Click your preference to update your RSVP."
  },
  {
    question: "Can I see who's going to an event?",
    answer: "Yes, each event shows an attendance summary with avatars of confirmed attendees. You can see the full list by clicking on the event to view its details."
  },
  {
    question: "How do events get approved?",
    answer: "Any member can create events directly in the calendar. If you prefer to gather opinions first, use the Suggestions feature to propose an idea and let members vote on it before creating the official event."
  },
  {
    question: "Is there a limit to how many events I can create?",
    answer: "No, there's no limit to the number of events you can create or participate in. Group Planner is designed to handle all your social planning needs."
  }
];

// Main Component
const Index = () => {
  // State
  const [events, setEvents] = useState<Event[]>(generateEvents());
  const [suggestions, setSuggestions] = useState<EventSuggestion[]>(mockEventSuggestions);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    location: "",
    startTime: new Date(),
    endTime: new Date(),
    rsvps: []
  });
  const [newSuggestion, setNewSuggestion] = useState<Partial<EventSuggestion>>({
    title: "",
    description: "",
    votes: []
  });
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'suggestions' | 'activity'>('home');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const startingDayIndex = getDay(monthStart);

  // Helper Functions
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(day, new Date(event.startTime))
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.startTime) >= today)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    const eventsOnDay = getEventsForDay(day);
    if (eventsOnDay.length > 0) {
      setSelectedEvent(eventsOnDay[0]);
      setIsEventModalOpen(true);
    } else {
      // Pre-fill the new event with the selected date
      const startTime = new Date(day);
      startTime.setHours(18, 0, 0);
      const endTime = new Date(day);
      endTime.setHours(20, 0, 0);
      
      setNewEvent({
        ...newEvent,
        startTime,
        endTime
      });
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateEvent = () => {
    const newEventWithDefaults: Event = {
      id: `e${events.length + 1}`,
      title: newEvent.title || "Untitled Event",
      description: newEvent.description || "",
      startTime: newEvent.startTime || new Date(),
      endTime: newEvent.endTime || new Date(),
      location: newEvent.location || "",
      createdBy: currentUser.id,
      rsvps: [{ userId: currentUser.id, status: "going" }]
    };

    setEvents([...events, newEventWithDefaults]);
    setNewEvent({
      title: "",
      description: "",
      location: "",
      startTime: new Date(),
      endTime: new Date()
    });
    setIsCreateModalOpen(false);
  };

  const handleCreateSuggestion = () => {
    if (!newSuggestion.title) return;
    
    const newSuggestionWithDefaults: EventSuggestion = {
      id: `s${suggestions.length + 1}`,
      title: newSuggestion.title,
      description: newSuggestion.description || "",
      votes: [currentUser.id]
    };

    setSuggestions([...suggestions, newSuggestionWithDefaults]);
    setNewSuggestion({
      title: "",
      description: "",
      votes: []
    });
    setIsSuggestionModalOpen(false);
  };
  
  const handleVote = (suggestionId: string) => {
    setSuggestions(
      suggestions.map((suggestion) => {
        if (suggestion.id === suggestionId) {
          const hasVoted = suggestion.votes.includes(currentUser.id);
          if (hasVoted) {
            return {
              ...suggestion,
              votes: suggestion.votes.filter((id) => id !== currentUser.id)
            };
          } else {
            return {
              ...suggestion,
              votes: [...suggestion.votes, currentUser.id]
            };
          }
        }
        return suggestion;
      })
    );
  };

  const handleRSVP = (eventId: string, status: "going" | "maybe" | "declined") => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const existingRSVP = event.rsvps.find(
            (rsvp) => rsvp.userId === currentUser.id
          );
          if (existingRSVP) {
            return {
              ...event,
              rsvps: event.rsvps.map((rsvp) =>
                rsvp.userId === currentUser.id ? { ...rsvp, status } : rsvp
              )
            };
          } else {
            return {
              ...event,
              rsvps: [...event.rsvps, { userId: currentUser.id, status }]
            };
          }
        }
        return event;
      })
    );
    setIsEventModalOpen(false);
  };

  const getUserById = (id: string) => {
    return mockUsers.find(user => user.id === id) || { 
      id: "unknown", 
      name: "Unknown User", 
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg" 
    };
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const featureItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Render functions for reusable UI components
  const renderEventBadges = (event: Event) => {
    const goingCount = event.rsvps.filter(rsvp => rsvp.status === "going").length;
    const maybeCount = event.rsvps.filter(rsvp => rsvp.status === "maybe").length;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <div className="flex -space-x-2 overflow-hidden">
            {event.rsvps
              .filter(rsvp => rsvp.status === "going")
              .slice(0, 3)
              .map((rsvp) => (
                <motion.img
                  key={rsvp.userId}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src={getUserById(rsvp.userId).avatar}
                  alt={getUserById(rsvp.userId).name}
                />
              ))}
          </div>
          {goingCount > 3 && (
            <span className="ml-1 text-xs text-gray-500">+{goingCount - 3}</span>
          )}
        </div>
        {maybeCount > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            {maybeCount} maybe
          </span>
        )}
      </div>
    );
  };
  
  const renderHeader = () => {
    return (
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <h1 className="text-2xl font-bold">Group Planner</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="mr-4 flex">
              <button
                className={`px-3 hover:font-semibold py-1 mx-1 rounded-md ${activeTab === 'home' ? 'bg-white text-teal-600 hover:font-normal' : 'text-white'}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </button>
              <button
                className={`px-3 hover:font-semibold py-1 mx-1 rounded-md ${activeTab === 'calendar' ? 'bg-white text-teal-600 hover:font-normal' : 'text-white'}`}
                onClick={() => setActiveTab('calendar')}
              >
                Calendar
              </button>
              <button
                className={`px-3 hover:font-semibold py-1 mx-1 rounded-md ${activeTab === 'suggestions' ? 'bg-white text-teal-600 hover:font-normal' : 'text-white'}`}
                onClick={() => setActiveTab('suggestions')}
              >
                Suggestions
              </button>
              <button
                className={`px-3 hover:font-semibold py-1 mx-1 rounded-md ${activeTab === 'activity' ? 'bg-white text-teal-600 hover:font-normal' : 'text-white'}`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </button>
            </div>
            
            <div className="flex items-center">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="h-8 w-8 rounded-full border-2 border-white" 
              />
              <span className="ml-2">{currentUser.name}</span>
            </div>
          </div>
          
          {/* Mobile Navigation Toggle and User Avatar */}
          <div className="flex items-center md:hidden">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-8 w-8 rounded-full border-2 border-white mr-2" 
            />
            <button 
              onClick={toggleMobileMenu}
              className="p-1 rounded-md hover:bg-teal-700 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-2 md:hidden">
            <div className="flex flex-col space-y-2">
              <button
                className={`px-3 py-2 rounded-md text-left ${activeTab === 'home' ? 'bg-white text-teal-600' : 'text-white hover:bg-teal-700'}`}
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button
                className={`px-3 py-2 rounded-md text-left ${activeTab === 'calendar' ? 'bg-white text-teal-600' : 'text-white hover:bg-teal-700'}`}
                onClick={() => {
                  setActiveTab('calendar');
                  setMobileMenuOpen(false);
                }}
              >
                Calendar
              </button>
              <button
                className={`px-3 py-2 rounded-md text-left ${activeTab === 'suggestions' ? 'bg-white text-teal-600' : 'text-white hover:bg-teal-700'}`}
                onClick={() => {
                  setActiveTab('suggestions');
                  setMobileMenuOpen(false);
                }}
              >
                Suggestions
              </button>
              <button
                className={`px-3 py-2 rounded-md text-left ${activeTab === 'activity' ? 'bg-white text-teal-600' : 'text-white hover:bg-teal-700'}`}
                onClick={() => {
                  setActiveTab('activity');
                  setMobileMenuOpen(false);
                }}
              >
                Activity
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
    );
  };

  const renderLanding = () => {
    const upcomingEvents = getUpcomingEvents();
    const nextEvent = upcomingEvents[0];
    
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 mt-28">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div 
              className="lg:w-1/2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-4xl font-bold text-gray-800 mb-6"
              >
                Plan events with friends, <br />
                <span className="text-teal-600">without the hassle.</span>
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-600 mb-8"
              >
                Create events, track who's coming, suggest new ideas, and keep everyone on the same page - all in one place.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#2a9d8f" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Event
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {nextEvent ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium mb-2">
                          Next Event
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{nextEvent.title}</h3>
                        <p className="text-gray-500 mb-4">
                          {format(new Date(nextEvent.startTime), "EEEE, MMMM d · h:mm a")}
                        </p>
                      </div>
                      <div className="bg-teal-50 rounded-lg p-2 text-center min-w-20">
                        <div className="text-2xl font-bold text-teal-700">
                          {format(new Date(nextEvent.startTime), "d")}
                        </div>
                        <div className="text-sm text-teal-600">
                          {format(new Date(nextEvent.startTime), "MMM")}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{nextEvent.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{nextEvent.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                          {format(new Date(nextEvent.startTime), "h:mm a")} - {format(new Date(nextEvent.endTime), "h:mm a")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {renderEventBadges(nextEvent)}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                        onClick={() => {
                          setSelectedEvent(nextEvent);
                          setIsEventModalOpen(true);
                        }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="text-gray-600">No upcoming events</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  };

  const renderCalendar = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={prevMonth}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <h2 className="text-xl font-semibold mx-4">
              {format(currentDate, dateFormat)}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={nextMonth}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Event
          </motion.button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="bg-white p-2 h-24 md:h-32"
            />
          ))}

          {/* Actual days of the month */}
          {days.map((day) => {
            const eventsOnDay = getEventsForDay(day);
            return (
              <motion.div
                key={day.toString()}
                whileHover={{ backgroundColor: "#f8f9fa" }}
                className={`bg-white p-2 h-24 md:h-32 cursor-pointer border ${
                  isSameDay(day, new Date()) ? "border-teal-400" : "border-transparent"
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between">
                  <span 
                    className={`
                      text-sm font-medium mb-1
                      ${!isSameMonth(day, currentDate) ? "text-gray-400" : ""}
                      ${isSameDay(day, new Date()) ? "bg-teal-500 text-white rounded-full h-6 w-6 flex items-center justify-center" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {eventsOnDay.slice(0, 3).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded text-xs text-teal-800 truncate"
                    >
                      {event.title}
                    </motion.div>
                  ))}
                  {eventsOnDay.length > 3 && (
                    <div className="text-xs text-gray-500 pl-2">
                      +{eventsOnDay.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEventList = () => {
    const upcomingEvents = getUpcomingEvents();
    
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsEventModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <div className="text-sm text-gray-500 mt-1">
                      {format(new Date(event.startTime), "EEE, MMM d · h:mm a")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{event.location}</div>
                    <div className="mt-2">
                      {renderEventBadges(event)}
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded text-center p-2 min-w-16">
                    <div className="text-lg font-bold text-teal-700">
                      {format(new Date(event.startTime), "d")}
                    </div>
                    <div className="text-xs text-gray-600">
                      {format(new Date(event.startTime), "MMM")}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No upcoming events
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderSuggestions = () => {
    return (
      <div className="mt-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Event Suggestions</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            onClick={() => setIsSuggestionModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Suggestion
          </motion.button>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {suggestions.map((suggestion) => {
            const hasVoted = suggestion.votes.includes(currentUser.id);
            return (
              <motion.div
                key={suggestion.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-800">{suggestion.title}</h3>
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{suggestion.votes.length}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-2">{suggestion.description}</p>
                  
                  <div className="mt-4">
                    <div className="flex -space-x-2 overflow-hidden mb-3">
                      {suggestion.votes.slice(0, 5).map((userId) => (
                        <motion.img
                          key={userId}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                          src={getUserById(userId).avatar}
                          alt={getUserById(userId).name}
                        />
                      ))}
                      {suggestion.votes.length > 5 && (
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 ring-2 ring-white text-xs text-gray-600">
                          +{suggestion.votes.length - 5}
                        </span>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(suggestion.id)}
                      className={`w-full py-2 rounded-md font-medium text-sm ${
                        hasVoted 
                          ? "bg-teal-100 text-teal-700 hover:bg-teal-200" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {hasVoted ? (
                        <span className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Voted
                        </span>
                      ) : "Vote"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  const renderActivity = () => {
    return (
      <div className="space-y-8 mt-20">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Activity</h2>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-4">Event Attendance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4AC2B0 " stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4AC2B0 " stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4AC274" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4AC274" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="events" stroke="#4AC2B0 " fillOpacity={1} fill="url(#colorEvents)" />
                  <Area type="monotone" dataKey="attendance" stroke="#4AC274" fillOpacity={1} fill="url(#colorAttendance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-teal-600">27</p>
            <p className="text-sm text-gray-500 mt-1">Over the last 6 months</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-2">Average Attendance</h3>
            <p className="text-3xl font-bold text-teal-600">85%</p>
            <p className="text-sm text-gray-500 mt-1">Group participation rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-2">Top Location</h3>
            <p className="text-xl font-bold text-teal-600">Sarah's Apartment</p>
            <p className="text-sm text-gray-500 mt-1">8 events hosted</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-medium text-gray-700 mb-4">Most Active Members</h3>
          <div className="space-y-3">
            {mockUsers.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-5">{index + 1}</span>
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full ml-2" />
                  <span className="ml-3 font-medium text-gray-800">{user.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.floor(Math.random() * 10) + 10} events attended
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCreateEventModal = () => {
    return (
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            >
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Create New Event</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="What's this event about?"
                    rows={3}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={format(newEvent.startTime || new Date(), "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setNewEvent({ ...newEvent, startTime: date });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={format(newEvent.endTime || new Date(), "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setNewEvent({ ...newEvent, endTime: date });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Where will this take place?"
                  />
                </div>
              </div>
              <div className="border-t p-4 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium ${!newEvent.title ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title}
                >
                  Create Event
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderEventModal = () => {
    if (!selectedEvent) return null;

    const currentUserRSVP = selectedEvent.rsvps.find(
      (rsvp) => rsvp.userId === currentUser.id
    );
    const currentStatus = currentUserRSVP ? currentUserRSVP.status : null;

    const goingCount = selectedEvent.rsvps.filter(rsvp => rsvp.status === "going").length;
    const maybeCount = selectedEvent.rsvps.filter(rsvp => rsvp.status === "maybe").length;
    const declinedCount = selectedEvent.rsvps.filter(rsvp => rsvp.status === "declined").length;

    return (
      <AnimatePresence>
        {isEventModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            >
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{selectedEvent.title}</h3>
                <button
                  onClick={() => setIsEventModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {format(new Date(selectedEvent.startTime), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {format(new Date(selectedEvent.startTime), "h:mm a")} - {format(new Date(selectedEvent.endTime), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Organized by {getUserById(selectedEvent.createdBy).name}</span>
                </div>
                
                <p className="text-gray-700">{selectedEvent.description}</p>
                
                <div className="border-t border-b py-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Who's Coming?</h4>
                  <div className="flex space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">{goingCount}</div>
                      <div className="text-sm text-gray-600">Going</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{maybeCount}</div>
                      <div className="text-sm text-gray-600">Maybe</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{declinedCount}</div>
                      <div className="text-sm text-gray-600">Declined</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.rsvps
                      .filter(rsvp => rsvp.status === "going")
                      .map((rsvp) => {
                        const user = getUserById(rsvp.userId);
                        return (
                          <div 
                            key={rsvp.userId} 
                            className="flex flex-col items-center"
                          >
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full border-2 border-teal-200"
                            />
                            <span className="text-xs mt-1 text-gray-600">{user.name.split(" ")[0]}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Your Response</h4>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-2 rounded-md font-medium text-sm ${
                        currentStatus === "going" 
                          ? "bg-teal-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleRSVP(selectedEvent.id, "going")}
                    >
                      Going
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-2 rounded-md font-medium text-sm ${
                        currentStatus === "maybe" 
                          ? "bg-yellow-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleRSVP(selectedEvent.id, "maybe")}
                    >
                      Maybe
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-2 rounded-md font-medium text-sm ${
                        currentStatus === "declined" 
                          ? "bg-red-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleRSVP(selectedEvent.id, "declined")}
                    >
                      Can't Go
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="border-t p-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium"
                  onClick={() => setIsEventModalOpen(false)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderSuggestionModal = () => {
    return (
      <AnimatePresence>
        {isSuggestionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            >
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Suggest New Event</h3>
                <button
                  onClick={() => setIsSuggestionModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newSuggestion.title}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter a title for your suggestion"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newSuggestion.description}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Add some details about your suggestion"
                    rows={4}
                  ></textarea>
                </div>
              </div>
              <div className="border-t p-4 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium"
                  onClick={() => setIsSuggestionModalOpen(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium ${!newSuggestion.title ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleCreateSuggestion}
                  disabled={!newSuggestion.title}
                >
                  Add Suggestion
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderFooter = () => {
    return (
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-teal-600 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <span className="font-medium text-gray-800">Group Planner</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">Plan events with friends, without the hassle.</p>
            </div>
            
            <div className="flex space-x-4">
              <a title="twitter" href="#" className="text-gray-500 hover:text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a title="facebook" href="#" className="text-gray-500 hover:text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Group Planner. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };

  // Home page content rendering
  const renderHomePage = () => {
    return (
      <div className="mt-8">
        {/* Hero section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="py-20 bg-gradient-to-br from-teal-400 to-teal-500 text-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                >
                  Organize Group Events <br />
                  <span className="text-teal-100">with Ease and Style</span>
                </motion.h1>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-xl text-teal-50 mb-8 max-w-lg"
                >
                  Group Planner makes it simple to plan events, track attendance, and keep everyone in the loop – all in one beautiful, easy-to-use platform.
                </motion.p>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                    onClick={() => setActiveTab('calendar')}
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all hover:bg-white/10"
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="md:w-1/2"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="bg-white rounded-lg shadow-xl overflow-hidden transform rotate-2 border-8 border-white relative">
                  <img
                    src="https://images.unsplash.com/photo-1527979809431-ea3d5c0c01c9?q=80&w=2109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Group of friends watching a movie"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-3">
                        {mockUsers.slice(0, 4).map(user => (
                          <motion.img 
                            key={user.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: Math.random() * 0.5 }}
                            src={user.avatar} 
                            alt="User avatar" 
                            className="h-8 w-8 rounded-full border-2 border-white" 
                          />
                        ))}
                      </div>
                      <span className="text-white text-sm font-medium">7 friends attending</span>
                    </div>
                    <h3 className="text-white text-lg font-semibold mt-1">Movie Night at Alex's</h3>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden transform -rotate-3 -mt-16 ml-20 border-8 border-white relative">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1723478515436-5f8e0202c909?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGdyb3VwJTIwb2YlMjBmcmllbmRzJTIwaGlraW5nfGVufDB8fDB8fHww"
                    alt="Group of friends hiking"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-lg font-semibold">Hiking Trip</h3>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats section */}
        <motion.section 
          className="py-16 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div 
                className="p-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-4xl font-bold text-teal-600 mb-2">10k+</p>
                <p className="text-gray-600">Events Planned</p>
              </motion.div>
              
              <motion.div 
                className="p-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-4xl font-bold text-teal-600 mb-2">92%</p>
                <p className="text-gray-600">Higher Attendance</p>
              </motion.div>
              
              <motion.div 
                className="p-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-4xl font-bold text-teal-600 mb-2">3.5k</p>
                <p className="text-gray-600">Active Groups</p>
              </motion.div>
              
              <motion.div 
                className="p-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-4xl font-bold text-teal-600 mb-2">8hrs</p>
                <p className="text-gray-600">Saved Per Week</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features section */}
        <motion.section 
          id="features"
          className="py-20 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                All the Tools You Need to Plan Successfully
              </h2>
              <p className="text-xl text-gray-600">
                Group Planner combines everything you need in one simple, beautiful interface.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-md p-8 border border-gray-100 transition-shadow hover:shadow-lg hover:shadow-teal-200"
                  variants={featureItemVariants}
                >
                  <div className="mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section 
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                How Group Planner Works
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600"
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Planning events with friends has never been simpler
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center text-teal-600 text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Create an Event</h3>
                <p className="text-gray-600">
                  Start by adding event details like title, date, time, and location. Everyone in your group will see it on the calendar.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center text-teal-600 text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Collect RSVPs</h3>
                <p className="text-gray-600">
                  Group members can easily respond with "Going," "Maybe," or "Can't Go." No more chasing people for responses.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center text-teal-600 text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Enjoy Your Event</h3>
                <p className="text-gray-600">
                  With everyone on the same page, you can focus on having a great time instead of managing logistics.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section 
          className="py-20 bg-gradient-to-br from-teal-50 to-teal-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of satisfied groups who've transformed their planning experience
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Got questions? We've got answers.
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              {faqItems.map((faq, index) => (
                <motion.div 
                  key={index}
                  className="mb-6 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button 
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                    onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                    <span className="ml-4">
                      {activeFaqIndex === index ? (
                        <svg className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {activeFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-teal-600 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to Make Group Planning Simple?
            </motion.h2>
            <motion.p 
              className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto"
              initial={{ y: -10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of groups who've transformed how they plan events together.
            </motion.p>
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-md transition-all hover:text-teal-700"
              onClick={() => setActiveTab('calendar')}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.section>
      </div>
    );
  };

  // App Rendering
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {renderHeader()}
      
      <main className="flex-1">
        {activeTab === 'home' && renderHomePage()}

        {activeTab === 'calendar' && (
          <>
            {renderLanding()}
            
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  {renderCalendar()}
                </div>
                <div className="md:w-1/3">
                  {renderEventList()}
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'suggestions' && (
          <div className="container mx-auto px-4 py-8">
            {renderSuggestions()}
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="container mx-auto px-4 py-8">
            {renderActivity()}
          </div>
        )}
      </main>
      
      {renderFooter()}
      
      {/* Modals */}
      {renderCreateEventModal()}
      {renderEventModal()}
      {renderSuggestionModal()}
    </div>
  );
};

export default Index;
