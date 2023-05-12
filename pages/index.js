import React, { useCallback, useEffect } from "react";
import "gantt-schedule-timeline-calendar/dist/style.css";

let GSTC, gstc, state;

const columnsFromDB = [
  {
    id: "id",
    label: "ID",
    hidden: false,
    data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
    sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
    width: 80,
    header: {
      content: "ID",
    },
  },
  {
    id: "name",
    label: "Name",
    data: "name",
    sortable: "name",
    width: 200,
    hidden: false,
    header: {
      content: "Name",
    },
  },
  {
    id: "surname",
    label: "Surname",
    data: "surname",
    sortable: "surname",
    width: 200,
    hidden: false,
    header: {
      content: "Surname",
    },
  },
  {
    id: "progress",
    label: "Progress",
    data: "progress",
    sortable: "progress",
    hidden: false,
    width: 200,
    header: {
      content: "progress",
    },
  },
];

async function initializeGSTC(element) {
  GSTC = (await import("gantt-schedule-timeline-calendar")).default;
  const TimelinePointer = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
    )
  ).Plugin;
  const Selection = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
    )
  ).Plugin;
  const ItemResizing = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js"
    )
  ).Plugin;
  const ItemMovement = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js"
    )
  ).Plugin;

  // helper functions

  function generateRows() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Rows }
     */
    const rows = {};
    for (let i = 0; i < 100; i++) {
      const id = GSTC.api.GSTCID(i.toString());
      rows[id] = {
        id,
        label: `Row ${i}`,
      };
    }
    return rows;
  }

  function generateItems() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Items }
     */
    const items = {};
    // @ts-ignore
    let start = GSTC.api.date().startOf("day").subtract(6, "day");
    for (let i = 0; i < 100; i++) {
      const id = GSTC.api.GSTCID(i.toString());
      const rowId = GSTC.api.GSTCID(Math.floor(Math.random() * 100).toString());
      start = start.add(1, "day");
      items[id] = {
        id,
        label: `Item ${i}`,
        rowId,
        time: {
          start: start.valueOf(),
          end: start.add(1, "day").endOf("day").valueOf(),
        },
      };
    }
    return items;
  }

  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
      "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
    list: {
      columns: {
        data: GSTC.api.fromArray(columnsFromDB),
      },
      rows: generateRows(),
    },
    chart: {
      items: generateItems(),
    },
  };

  state = GSTC.api.stateFromConfig(config);

  gstc = GSTC({
    element,
    state,
  });
}

export default function Home() {
  const callback = useCallback((element) => {
    if (element) initializeGSTC(element);
  }, []);

  useEffect(() => {
    return () => {
      if (gstc) {
        gstc.destroy();
      }
    };
  });

  const handChange = (ev) => {
    state.update(
      `config.list.columns.data.gstcid-${ev.target.value}.hidden`,
      !ev.target.checked
    );
  };

  return (
    <div className="container">
      {columnsFromDB.map((item) => (
        <label key={item.id}>
          <input
            type="checkbox"
            value={item.id}
            defaultChecked={!item.hidden}
            onChange={handChange}
          />
          {item.label}
        </label>
      ))}
      <hr />
      <div id="gstc" ref={callback}></div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
