import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MOCK_BILLING, MOCK_PATIENTS } from "@/lib/mock-data";
import type { BillingRecord, Patient } from "@/lib/types";
import {
  CreditCard,
  DollarSign,
  FileText,
  Plus,
  Printer,
  Receipt,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GST_RATE = 0.18;

type LineItem = {
  id: string;
  description: string;
  amount: number;
};

const DEFAULT_LINE_ITEMS: LineItem[] = [
  { id: "consultation", description: "Consultation Fee", amount: 150 },
];

function toLineItems(record: BillingRecord): LineItem[] {
  const items: LineItem[] = [];
  if (record.consultationFee > 0)
    items.push({
      id: "consultation",
      description: "Consultation Fee",
      amount: record.consultationFee,
    });
  if (record.labCharges > 0)
    items.push({
      id: "lab",
      description: "Laboratory Charges",
      amount: record.labCharges,
    });
  if (record.medicineCharges > 0)
    items.push({
      id: "medicine",
      description: "Pharmacy / Medicine Charges",
      amount: record.medicineCharges,
    });
  if (record.roomCharges > 0)
    items.push({
      id: "room",
      description: "Room / Bed Charges",
      amount: record.roomCharges,
    });
  return items;
}

export default function Billing() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>(DEFAULT_LINE_ITEMS);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceRecord, setInvoiceRecord] = useState<BillingRecord | null>(
    null,
  );

  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      search.length > 0 &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())),
  );

  const existingBill = selectedPatient
    ? (MOCK_BILLING.find((b) => b.patientId === selectedPatient.id) ?? null)
    : null;

  function selectPatient(p: Patient) {
    setSelectedPatient(p);
    setSearch(p.name);
    setShowSuggestions(false);
    const bill = MOCK_BILLING.find((b) => b.patientId === p.id);
    if (bill) {
      setLineItems(toLineItems(bill));
    } else {
      setLineItems(DEFAULT_LINE_ITEMS);
    }
  }

  function addLineItem() {
    if (!newDesc.trim() || !newAmount) {
      toast.error("Please enter a description and amount");
      return;
    }
    const amount = Number.parseFloat(newAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLineItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, description: newDesc.trim(), amount },
    ]);
    setNewDesc("");
    setNewAmount("");
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }

  const subtotal = lineItems.reduce((s, item) => s + item.amount, 0);
  const tax = subtotal * GST_RATE;
  const total = subtotal + tax;

  function handleGenerateInvoice() {
    if (!selectedPatient) {
      toast.error("Please select a patient first");
      return;
    }
    if (!paymentMode) {
      toast.error("Please select a payment mode");
      return;
    }
    if (lineItems.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }
    const record: BillingRecord = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      date: new Date().toISOString().split("T")[0],
      consultationFee:
        lineItems.find((i) => i.id === "consultation")?.amount ?? 0,
      labCharges: lineItems.find((i) => i.id === "lab")?.amount ?? 0,
      medicineCharges: lineItems.find((i) => i.id === "medicine")?.amount ?? 0,
      roomCharges: lineItems.find((i) => i.id === "room")?.amount ?? 0,
      total: Math.round(total),
      status: "Paid",
      paymentMethod: paymentMode as BillingRecord["paymentMethod"],
    };
    setInvoiceRecord(record);
    setShowInvoice(true);
    toast.success("Invoice generated!", {
      description: `Total: $${Math.round(total).toLocaleString()} via ${paymentMode}`,
    });
  }

  return (
    <div className="space-y-6" data-ocid="billing.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Receipt className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Billing
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate invoices and manage payment records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Patient Selection + Line Items */}
        <div className="xl:col-span-2 space-y-5">
          {/* Patient Search */}
          <div className="glass-elevated rounded-xl p-5 shadow-glass-sm space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              Select Patient
            </h3>
            <div className="relative">
              <Input
                data-ocid="billing.patient_search.input"
                placeholder="Search by name or patient ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedPatient(null);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              {showSuggestions && filteredPatients.length > 0 && (
                <div
                  data-ocid="billing.patient_suggestions.popover"
                  className="absolute z-50 w-full mt-1 glass-elevated rounded-lg border border-border shadow-glass overflow-hidden"
                >
                  {filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      data-ocid={`billing.patient_suggestion.${p.id}`}
                      className="w-full text-left px-4 py-2.5 hover:bg-muted/30 transition-colors flex items-center justify-between"
                      onClick={() => selectPatient(p)}
                    >
                      <span className="text-sm font-medium text-foreground">
                        {p.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Patients */}
            {!selectedPatient && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Recent Patients
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOCK_BILLING.slice(0, 4).map((b) => {
                    const p = MOCK_PATIENTS.find((pt) => pt.id === b.patientId);
                    if (!p) return null;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        data-ocid={`billing.recent_patient.${p.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs border border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-smooth"
                        onClick={() => {
                          setSearch(p.name);
                          selectPatient(p);
                        }}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedPatient && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {selectedPatient.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPatient.id} · {selectedPatient.age} yrs ·{" "}
                      {selectedPatient.bloodGroup}
                    </p>
                  </div>
                  {existingBill && (
                    <Badge
                      variant="outline"
                      className={`text-xs border ${
                        existingBill.status === "Paid"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : existingBill.status === "Partial"
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-accent/20 text-accent border-accent/30"
                      }`}
                    >
                      Previous: {existingBill.status}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="glass-elevated rounded-xl p-5 shadow-glass-sm space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Billing Line Items
            </h3>

            <div className="space-y-2">
              {lineItems.map((item, i) => (
                <div
                  key={item.id}
                  data-ocid={`billing.line_item.${i + 1}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border"
                >
                  <span className="flex-1 text-sm text-foreground">
                    {item.description}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    ${item.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    data-ocid={`billing.line_item.delete_button.${i + 1}`}
                    onClick={() => removeLineItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add line item */}
            <div className="flex gap-2">
              <Input
                data-ocid="billing.add_item.description.input"
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="flex-1"
              />
              <Input
                data-ocid="billing.add_item.amount.input"
                placeholder="Amount"
                type="number"
                min="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-32"
              />
              <Button
                type="button"
                variant="outline"
                data-ocid="billing.add_item.button"
                onClick={addLineItem}
                className="gap-1 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Summary + Payment */}
        <div className="space-y-5">
          <div className="glass-elevated rounded-xl p-5 shadow-glass-sm space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Invoice Summary
            </h3>

            <div className="space-y-2.5">
              {lineItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">
                    {item.description}
                  </span>
                  <span className="text-foreground font-medium flex-shrink-0">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-accent">
                ${Math.round(total).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="glass-elevated rounded-xl p-5 shadow-glass-sm space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Payment Mode
            </h3>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger data-ocid="billing.payment_mode.select">
                <SelectValue placeholder="Select payment mode..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              data-ocid="billing.generate_invoice.button"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
              onClick={handleGenerateInvoice}
            >
              <FileText className="w-4 h-4" />
              Generate Invoice
            </Button>
          </div>

          {/* Recent Bills */}
          <div className="glass-elevated rounded-xl p-5 shadow-glass-sm space-y-3">
            <h3 className="font-semibold text-foreground text-sm">
              Recent Bills
            </h3>
            {MOCK_BILLING.slice(0, 3).map((b, i) => (
              <div
                key={b.id}
                data-ocid={`billing.recent.item.${i + 1}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {b.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xs font-bold text-foreground">
                    ${b.total.toLocaleString()}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-xs border mt-0.5 ${
                      b.status === "Paid"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : b.status === "Partial"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-accent/20 text-accent border-accent/30"
                    }`}
                  >
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceRecord && (
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent
            data-ocid="billing.invoice.dialog"
            className="max-w-lg glass-elevated border border-border"
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-accent" />
                Invoice #{invoiceRecord.id}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Hospital Header */}
              <div className="text-center pb-4 border-b border-border">
                <h3 className="text-lg font-bold text-foreground font-display">
                  MediCore Hospital
                </h3>
                <p className="text-xs text-muted-foreground">
                  1000 Healthcare Blvd, Chicago, IL
                </p>
                <p className="text-xs text-muted-foreground">
                  Tel: +1 555-MEDI · GST: 22ABCDE1234F1Z5
                </p>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="font-medium text-foreground">
                    {invoiceRecord.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invoice Date</p>
                  <p className="font-medium text-foreground">
                    {invoiceRecord.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invoice No.</p>
                  <p className="font-medium text-foreground">
                    {invoiceRecord.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Mode</p>
                  <p className="font-medium text-foreground">
                    {invoiceRecord.paymentMethod}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Line Items */}
              <div className="space-y-2">
                {lineItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="font-medium text-foreground">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span className="text-foreground">Total</span>
                  <span className="text-accent">
                    ${Math.round(total).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="billing.invoice.close_button"
                  className="flex-1"
                  onClick={() => setShowInvoice(false)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  data-ocid="billing.invoice.print.button"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                  onClick={() => {
                    window.print();
                    toast.success("Printing invoice...");
                  }}
                >
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
