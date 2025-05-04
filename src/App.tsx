import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import api, { submitApplication } from "./services/api";

// Define the form schema with corrected validations
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(10, "Name is too long"),
  contact_phone: z.string().min(1, "Phone number is required"),
  contact_email: z.string().email("Invalid email address"),
  job_level_id: z.string().min(1, "Please select a position"),
  role_id: z.string().min(1, "Please select a job"),
  resume: z.string().url("Invalid URL"),
});

export default function App() {
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [jobs, setJobs] = useState<{ id: string; name: string }[]>([]);
  const [jobLevels, setJobLevels] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      contact_phone: "",
      contact_email: "",
      job_level_id: "",
      role_id: "",
      resume: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    try {
      const response = await submitApplication(data);
      if (response.status === 200 ||  response.status === 201) {
        setSubmittedData(response.data);
        setSubmitStatus("Application submitted successfully!");
        setIsDialogOpen(true); // Open dialog on success
        form.reset(); // Reset form
      } else {
        setSubmitStatus("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("Failed to submit application. Please try again.");
    }
  };

  // Fetch jobs and job levels
  const fetchJob = async () => {
    try {
      const response = await api.get("/jobs");
      if (response.status === 200) {
        setJobs(response.data);
      } else {
        setError("Failed to fetch jobs.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs.");
    }
  };

  const fetchJobLevel = async () => {
    try {
      const response = await api.get("/job-levels");
      if (response.status === 200) {
        setJobLevels(response.data);
      } else {
        setError("Failed to fetch job levels.");
      }
    } catch (error) {
      console.error("Error fetching job levels:", error);
      setError("Failed to fetch job levels.");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchJob();
    fetchJobLevel();
  }, []);

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSubmitStatus(null); // Clear submit status
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Job Application Form
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Applied</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobs.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="job_level_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobLevels.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume Link</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="https://example.com/resume.pdf"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Application
          </Button>
          {submitStatus && !isDialogOpen && (
            <p className="mt-4 text-center">{submitStatus}</p>
          )}
        </form>
      </Form>

      {/* Success Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Submitted!</DialogTitle>
            <DialogDescription>
              Your job application has been successfully submitted. We'll get back
              to you soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose} variant="default">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}