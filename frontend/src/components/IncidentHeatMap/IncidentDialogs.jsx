import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  Eye,
} from "lucide-react";

const IncidentDialogs = ({
  witnessDialogOpen,
  setWitnessDialogOpen,
  witnessInfo,
  setWitnessInfo,
  witnessEmail,
  setWitnessEmail,
  submittingWitness,
  handleWitnessSubmit,
  incidentDialogOpen,
  setIncidentDialogOpen,
  selectedIncident,
}) => {
  return (
    <>
      <Dialog
        open={witnessDialogOpen}
        onOpenChange={setWitnessDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Witness Information</DialogTitle>
            <DialogDescription>
              Share what you witnessed about this incident. Your
              information will be submitted anonymously.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="witness-info">
                What did you see?
              </Label>
              <Textarea
                id="witness-info"
                placeholder="e.g., Red SUV, partial plate 7XK, backed into a black sedan at around 3:15pm..."
                value={witnessInfo}
                onChange={(e) => setWitnessInfo(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="witness-email">
                Contact Email (Optional)
              </Label>
              <Input
                id="witness-email"
                type="email"
                placeholder="your.email@example.com"
                value={witnessEmail}
                onChange={(e) => setWitnessEmail(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only provide if you're willing to be contacted for
                follow-up questions
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setWitnessDialogOpen(false);
                setWitnessInfo("");
                setWitnessEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWitnessSubmit}
              disabled={!witnessInfo.trim() || submittingWitness}
            >
              {submittingWitness
                ? "Submitting..."
                : "Submit Anonymously"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={incidentDialogOpen}
        onOpenChange={setIncidentDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedIncident?.color }}
              />
              {selectedIncident?.incidentType}
            </DialogTitle>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm">
                    {new Date(
                      selectedIncident.date
                    ).toLocaleDateString("en-AU")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm">
                    {new Date(
                      selectedIncident.date
                    ).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Car size={16} className="text-gray-500" />
                <span className="text-sm">
                  {selectedIncident.vehicleType}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-gray-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm">
                  {selectedIncident.addressString}
                </span>
              </div>

              {selectedIncident.description && (
                <div>
                  <Label className="text-sm font-medium">
                    Description:
                  </Label>
                  <div
                    className="mt-1 p-3 bg-gray-50 rounded-md border-l-4"
                    style={{
                      borderLeftColor: selectedIncident.color,
                    }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedIncident.description}
                    </p>
                  </div>
                </div>
              )}

              {selectedIncident.incidentType ===
                "Request For Information" && (
                <Button
                  onClick={() => {
                    setIncidentDialogOpen(false);
                    setWitnessDialogOpen(true);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <Eye size={16} className="mr-2" />
                  Add Witness Information
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncidentDialogs;