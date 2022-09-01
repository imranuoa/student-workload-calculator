import type { SvelteComponent } from "svelte";
import primaryMeeting from "./form-components/primary-meeting.svelte";

// Component type
export interface Component {
    name: string;
    description: string;
    form: any;
    dataTemplate: ComponentData;
}
// An instance of the component type
export interface componentInstance {
    type: string;
    data: ComponentData;
}

export enum Frequency {
    Weekly,
    Semester,
}

// Data for the instance of the component type
export interface ComponentData {
    name: string;
    freq: Frequency;
    [key: string]: any;
    calculated?: calculatedResults;
}

export interface calculatedResults {
    occurences: number;
    prepHoursPer: number;
    independantHoursPer: number;
    scheduledHoursPer: number;
    postActivityHoursPer: number;
}

const components : Component[] = [
    {
        name: "Primary Class Meeting",
        description: ``,
        form: primaryMeeting,
        dataTemplate: {
            name: "Lectures",
            freq: Frequency.Weekly,
            meetingsPerWeek: 1,
            meetingLength: 1,
        }
    }
]

export default components;