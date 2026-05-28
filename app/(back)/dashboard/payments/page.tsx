import {
  CreditCard,
  DollarSign,
  Search,
  CircleCheck,
  Clock3,
  XCircle,
  Wallet,
} from "lucide-react";

export default function PaymentsPage() {
  const payments = [
    {
      id: "PAY-001",
      user: "Ahmed Mohamed",
      plate: "4821 FDS",
      amount: "$12",
      method: "Visa",
      status: "Paid",
      date: "Today",
    },
    {
      id: "PAY-002",
      user: "Omar Ali",
      plate: "7742 KLM",
      amount: "$8",
      method: "Cash",
      status: "Pending",
      date: "Today",
    },
    {
      id: "PAY-003",
      user: "Sara Khaled",
      plate: "1935 XZT",
      amount: "$15",
      method: "MasterCard",
      status: "Failed",
      date: "Yesterday",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b1020] px-10 py-8 text-white">
      <section className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold">
              Payments
            </h1>

            <p className="mt-3 text-slate-400">
              Track parking payments and transaction history.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            <Wallet size={20} />
            New Payment
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <DollarSign className="text-green-400" size={38} />

            <p className="mt-5 text-slate-400">
              Total Revenue
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              $35
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <CircleCheck className="text-blue-400" size={38} />

            <p className="mt-5 text-slate-400">
              Successful Payments
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              1
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <Clock3 className="text-yellow-400" size={38} />

            <p className="mt-5 text-slate-400">
              Pending Payments
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              1
            </h2>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <Search className="text-slate-400" />

          <input
            placeholder="Search by payment ID, user, or plate..."
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl">
          <div className="grid grid-cols-7 border-b border-white/10 pb-4 text-sm font-semibold text-slate-400">
            <span>Payment ID</span>
            <span>User</span>
            <span>Plate</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-white/10">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-7 items-center py-5"
              >
                <span className="font-bold text-blue-300">
                  {payment.id}
                </span>

                <span className="text-slate-300">
                  {payment.user}
                </span>

                <span className="text-slate-300">
                  {payment.plate}
                </span>

                <span className="font-semibold text-green-400">
                  {payment.amount}
                </span>

                <span className="flex items-center gap-2 text-slate-300">
                  <CreditCard
                    size={16}
                    className="text-blue-400"
                  />

                  {payment.method}
                </span>

                <span className="text-slate-300">
                  {payment.date}
                </span>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                    payment.status === "Paid"
                      ? "bg-green-500/15 text-green-300"
                      : payment.status === "Pending"
                      ? "bg-yellow-500/15 text-yellow-300"
                      : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {payment.status === "Paid" ? (
                    <CircleCheck size={16} />
                  ) : payment.status === "Pending" ? (
                    <Clock3 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}

                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}