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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import api, { submitApplication } from "./services/api";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Please select a position"),
  level: z.string().min(1, "Please select a level"),
  resume: z.any(),
});

export default function App() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      position: "",
      level: "",
      resume: null,
    },
  });

  const [submittedData, setSubmittedData] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [jobs, setJobs] = useState<{ id: string; name: string }[]>([]);
  const [jobLevel, setJobLevel] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [roleId, setRoleId] = useState<string>("");
  const [resume, setResume] = useState<string>("");


  const onSubmit = async (data: any) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    try {
      const response = await submitApplication({
        name: name,
        contact_email: "0909090",
        contact_phone: "vcc@concac",
        role_id: "7721b635-cfd6-4e83-8af4-001bd50cfe30",
        resume: "gaylord",
      });
      setSubmittedData(response);
      setSubmitStatus("Application submitted successfully!");
      form.reset(); // Clear form after success
      setFileName(null); // Clear file name
    } catch (error) {
      setSubmitStatus("Failed to submit application. Please try again.");
    }
  };

  const fetchJob = async () => {
    const response = await api.get("/jobs");
    if (response.status === 200) {
      setJobs(response.data);
    } else {
      console.error("Error fetching jobs:", response.status);
    }
    console.log("check whatresobse", response.status);
  };
  const fetchJob_level = async () => {
    const res = await api.get("/job-levels");
    if (res.status === 200) {
      setJobLevel(res.data);
    } else {
      console.error("Error fetching job levels:", res.status);
    }
  };

  useEffect(() => {
    fetchJob();
    fetchJob_level();
  }, []);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Job Application Form
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
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
            name="email"
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
            name="position"
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
                      <SelectItem value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
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
                    {jobLevel.map((item) => (
                      <SelectItem value={item.id}>{item.name}</SelectItem>
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
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Upload CV</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFileName(file ? file.name : null);
                      onChange(file);
                    }}
                  />
                </FormControl>
                {fileName && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {fileName}
                  </p>
                )}
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
          {submitStatus && <p className="mt-4 text-center">{submitStatus}</p>}
        </form>
      </Form>
    </div>
  );
}
