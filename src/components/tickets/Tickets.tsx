'use client';

import React from "react";
import ToastWrapper from "@components/common/ToastWrapper";

const TICKETS_URL = "https://www.clooza.com/en/events/GCA2026";

type TicketDay = "workshop" | "conference";

type TicketOption = {
  title: string;
  type: string;
  price: string;
  description: string;
  perks: string[];
  days: TicketDay[];
};

const ticketOptions: TicketOption[] = [
  {
    title: "Student Conference Tickets",
    type: "Single",
    price: "KSh 3,000",
    description: "Access to conference for students with a valid student ID.",
    perks: ["Access to the conference days, valid with a student ID."],
    days: ["conference"],
  },
  {
    title: "Conference Days Standard",
    type: "Single",
    price: "KSh 8,000",
    description: "Access to conference days.",
    perks: ["Access to conference days only."],
    days: ["conference"],
  },
  {
    title: "Student Workshop Ticket",
    type: "Single",
    price: "KSh 4,000",
    description: "Access to the workshop, valid with a student ID.",
    perks: ["Access to the workshop, valid with a student ID."],
    days: ["workshop"],
  },
  {
    title: "Workshop Ticket",
    type: "Single",
    price: "KSh 5,000",
    description: "Gives you access to workshop with Bill Kennedy.",
    perks: ["Access to only the workshop day."],
    days: ["workshop"],
  },
  {
    title: "Student Workshop And Conference Days Ticket",
    type: "Single",
    price: "KSh 5,000",
    description:
      "Access to the workshop and conference days (valid with a student ID).",
    perks: [
      "Access to the workshop and conference days, valid with a student ID.",
    ],
    days: ["workshop", "conference"],
  },
  {
    title: "Workshop And Conference Days",
    type: "Single",
    price: "KSh 7,000",
    description: "Gives you access to workshop and conference days.",
    perks: ["Access to the workshop and conference days."],
    days: ["workshop", "conference"],
  },
];

const dayFilters: Array<{ key: string; label: string; includes: TicketDay | "all" }> =
  [
    { key: "all", label: "All days", includes: "all" },
    { key: "thu", label: "Thu, 15 Oct", includes: "workshop" },
    { key: "fri", label: "Fri, 16 Oct", includes: "conference" },
    { key: "sat", label: "Sat, 17 Oct", includes: "conference" },
  ];
export default function Tickets() {
  const [activeDayKey, setActiveDayKey] = React.useState<
    (typeof dayFilters)[number]["key"]
  >("all");
  const activeFilter = dayFilters.find((f) => f.key === activeDayKey) ?? dayFilters[0];
  const activeIncludes = activeFilter.includes;
  const filteredTickets =
    activeIncludes === "all"
      ? ticketOptions
      : ticketOptions.filter((ticket) => ticket.days.includes(activeIncludes));

  return (
    <section
      id="tickets"
      className="py-24 bg-linear-to-b from-white via-[#E8F5E9] to-white relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-medium text-gray-900">Tickets</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Choose your ticket option. Workshop: Thu, 15 Oct. Conference: Fri,
            16 Oct and Sat, 17 Oct.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Filter tickets by date
            </p>
            <div className="flex flex-wrap gap-2">
              {dayFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveDayKey(filter.key)}
                  aria-pressed={activeDayKey === filter.key}
                  className={[
                    "min-h-[44px] inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors",
                    activeDayKey === filter.key
                      ? "border-[#006B3F] bg-[#E8F5E9] text-[#006B3F]"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100",
                    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#006B3F]",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredTickets.map((ticket, index) => (
            <div
              key={ticket.title}
              className={
                index === filteredTickets.length - 1
                  ? ""
                  : "border-b border-gray-200"
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-medium text-gray-900">
                      {ticket.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {ticket.type}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {ticket.price}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ticket.days.includes("workshop") && (
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                          Workshop
                        </span>
                      )}
                      {ticket.days.includes("conference") && (
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                          Conference
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{ticket.description}</p>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Perks
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        {ticket.perks.map((perk) => (
                          <li key={perk}>{perk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#006B3F]">
                      {ticket.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#006B3F] text-white px-6 py-3 rounded-md hover:bg-[#005A35] transition-colors duration-200 font-semibold min-h-[44px] inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#006B3F]"
          >
            Get Ticket
          </a>
        </div>

        {/* Scholarships */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-medium mb-4">Scholarships</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We are happy to offer diversity scholarships to support members of
            underrepresented groups who may not otherwise have the opportunity
            to attend the conference. Please apply using this form. Applications
            close on [ To be announced ] (end-of-day WAT).
          </p>
          <ToastWrapper message="To be announced soon!" className="ml-4">
            <span className="text-xl font-medium">
              {" "}
              <button className="bg-[#006B3F] text-white px-4 py-2 rounded-md hover:bg-[#005A35] transition-colors duration-200">
                Apply using this form
              </button>
            </span>
          </ToastWrapper>
        </div>

        {/* Refund Policy */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-medium mb-4">Refund policy</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer refunds for all requests made before [ To be announced ]
            (end-of-day WAT). There will be a 10% fee for all refunds to cover
            ticketing and payment processing costs.
          </p>
        </div>
      </div>
    </section>
  );
}
