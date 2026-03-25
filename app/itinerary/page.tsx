export default function ItineraryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-bold mb-2">Itinerary</h1>
      <p className="text-gray-400 mb-10">May 1 – 3, 2026</p>

      <div className="flex flex-col gap-10">
        {/* Day 1 */}
        <section>
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Friday, May 1
          </h2>
          <div className="flex flex-col gap-3">
            <ItineraryItem time="4:00 PM" title="Check-in & Welcome" />
            <ItineraryItem time="6:00 PM" title="Welcome Drinks & Catch-up" />
            <ItineraryItem time="8:00 PM" title="Dinner" />
          </div>
        </section>

        {/* Day 2 */}
        <section>
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Saturday, May 2
          </h2>
          <div className="flex flex-col gap-3">
            <ItineraryItem time="9:00 AM" title="Breakfast" />
            <ItineraryItem time="11:00 AM" title="Group Activity (TBD)" />
            <ItineraryItem time="1:00 PM" title="Lunch" />
            <ItineraryItem time="3:00 PM" title="Free Time / Explore" />
            <ItineraryItem time="6:00 PM" title="Reunion Dinner" />
            <ItineraryItem time="9:00 PM" title="Evening Social" />
          </div>
        </section>

        {/* Day 3 */}
        <section>
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Sunday, May 3
          </h2>
          <div className="flex flex-col gap-3">
            <ItineraryItem time="9:00 AM" title="Brunch" />
            <ItineraryItem time="11:00 AM" title="Farewell & Check-out" />
          </div>
        </section>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Schedule is subject to change. We&apos;ll keep this page updated as
        plans finalize.
      </p>
    </div>
  );
}

function ItineraryItem({ time, title }: { time: string; title: string }) {
  return (
    <div className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
      <span className="text-sm font-mono text-gray-400 w-20 shrink-0">
        {time}
      </span>
      <span className="font-medium">{title}</span>
    </div>
  );
}
