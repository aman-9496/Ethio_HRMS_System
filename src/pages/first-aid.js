import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, PlusCircle, Activity, ClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FirstAidDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    nationalId: "",
    description: "",
    bloodPressure: "",
    heartRate: "",
  });

  // Protect route
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "first-aid") {
      router.replace("/");
    }
  }, [session, status, router]);

  // Fetch past emergency logs
  const fetchLogs = async () => {
    if (!session?.user?.email) return;
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`/api/emergency-logs?email=${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        toast.error("Failed to load past emergency logs");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while loading logs");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "first-aid") {
      fetchLogs();
    }
  }, [status, session]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      toast.error("Emergency Description is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patientName: formData.patientName,
        nationalId: formData.nationalId,
        description: formData.description,
        vitalSigns: {
          bloodPressure: formData.bloodPressure,
          heartRate: formData.heartRate,
        },
        responderEmail: session.user.email,
      };

      const res = await fetch("/api/emergency-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Emergency Log submitted successfully!");
        setFormData({
          patientName: "",
          nationalId: "",
          description: "",
          bloodPressure: "",
          heartRate: "",
        });
        fetchLogs(); // Refresh the table automatically
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to submit log.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || !session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-primary flex items-center">
          <Activity className="mr-3 h-8 w-8" />
          First Responder Dashboard
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Log Form */}
          <Card className="lg:col-span-1 shadow-md border-t-4 border-t-red-500">
            <CardHeader className="bg-red-50 dark:bg-red-900/10 rounded-t-md">
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Emergency Log
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Emergency Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="e.g. Car accident, severe bleeding from left arm..."
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name (If known)</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    placeholder="John Doe"
                    value={formData.patientName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID (If known)</Label>
                  <Input
                    id="nationalId"
                    name="nationalId"
                    placeholder="NAT-123456"
                    value={formData.nationalId}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      name="bloodPressure"
                      placeholder="120/80"
                      value={formData.bloodPressure}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate</Label>
                    <Input
                      id="heartRate"
                      name="heartRate"
                      placeholder="72 bpm"
                      value={formData.heartRate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    "Submit Emergency Report"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Past Logs Table */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 rounded-t-md border-b">
              <CardTitle className="flex items-center text-gray-700 dark:text-gray-200">
                <ClipboardList className="mr-2 h-5 w-5" />
                My Recent Dispatches
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingLogs ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                  <Activity className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No emergency logs found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new emergency dispatch report.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead>Date / Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Vitals</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="whitespace-nowrap font-medium">
                            {new Date(log.dateAdded).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div>{log.patientName}</div>
                            {log.nationalId && <div className="text-xs text-gray-500">{log.nationalId}</div>}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={log.description}>
                            {log.description}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="whitespace-nowrap">BP: {log.vitalSigns?.bloodPressure || "N/A"}</div>
                            <div className="whitespace-nowrap">HR: {log.vitalSigns?.heartRate || "N/A"}</div>
                          </TableCell>
                          <TableCell>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${log.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                ${log.status === "Admitted" ? "bg-blue-100 text-blue-800" : ""}
                                ${log.status === "Resolved" ? "bg-green-100 text-green-800" : ""}
                              `}
                            >
                              {log.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
