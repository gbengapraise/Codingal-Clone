import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// Mock Data Schema
export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  ages: z.string(),
  level: z.string(),
  lessons: z.number(),
  popular: z.boolean().optional(),
});

export type Course = z.infer<typeof CourseSchema>;

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Scratch Programming",
    description: "Learn the basics of coding with block-based programming. Perfect for beginners!",
    image: "scratch-course.png",
    ages: "Grade 1-4",
    level: "Beginner",
    lessons: 24,
    popular: true,
  },
  {
    id: "2",
    title: "Python for Kids",
    description: "Master one of the world's most popular programming languages through fun projects.",
    image: "python-course.png",
    ages: "Grade 5-8",
    level: "Intermediate",
    lessons: 36,
    popular: true,
  },
  {
    id: "3",
    title: "Web Development",
    description: "Build your own interactive websites using HTML, CSS, and JavaScript.",
    image: "web-dev-course.png",
    ages: "Grade 7-12",
    level: "Advanced",
    lessons: 48,
  },
  {
    id: "4",
    title: "App Development",
    description: "Design and create your own mobile apps for Android and iOS devices.",
    image: "app-dev-course.png",
    ages: "Grade 6-10",
    level: "Intermediate",
    lessons: 32,
  },
  {
    id: "5",
    title: "Artificial Intelligence",
    description: "Explore the fascinating world of AI, Machine Learning, and neural networks.",
    image: "ai-course.png",
    ages: "Grade 9-12",
    level: "Advanced",
    lessons: 40,
    popular: true,
  },
  {
    id: "6",
    title: "Game Development",
    description: "Create your own 2D and 3D games from scratch using professional tools.",
    image: "game-dev-course.png",
    ages: "Grade 4-8",
    level: "Beginner",
    lessons: 28,
  },
];

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_COURSES;
    },
  });
}

export function useSubmitBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { childName: string, parentEmail: string, phone: string, grade: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: "Booking confirmed!" };
    },
    onSuccess: () => {
      // In a real app we'd invalidate bookings or user data
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
  });
}
