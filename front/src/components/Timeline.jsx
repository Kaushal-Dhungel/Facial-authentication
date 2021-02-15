import React from 'react';

const timelineData = [
    {
        text: 'Register With User Account',
        category: {
			tag: 'Step - 1',
			color: '#ff006a'
		},
    },
    {
        text: `Create An Event. An event holds the record of people belonging to a particular group or category.
        Suppose, in a school, an event can represent a particular grade, i.e all the students from
        grade 1 will belong to one event, grade 2 to another event and so on.`,
        category: {
			tag: 'Step - 2',
			color: '#e17b77'
		},
    },
    {
        text :'Train the model for each face belonging to a particular event. It can be done with camera or by uploading the picture.',
        category: {
			tag: 'Step - 3',
			color: '#1DA1F2'
		},
    },
    {
        text: `Create A Subevent. Subevents are the subsets of an event. A subevent will inherit all the records of its parent event.
        If January is an event then each day of January can be a subevent. This way same record can be used for each day without the need to retrain the model. `,
        category: {
			tag: 'Step - 4',
			color: '#018f69'
		},
    },
    {
        text: 'Now verification can be performed for each subevent.',
        category: {
			tag: 'Step - 5',
			color: '#ff006a'
		},
    }
]


const TimelineItem = ({ data }) => (
    <div className="timeline-item">
        <div className="timeline-item-content">
            <span className="tag" style={{ background: data.category.color }}>
                {data.category.tag}
            </span>
            <p>{data.text}</p>
            <span className="circle" />
        </div>
    </div>
);

const Timeline = () =>
    timelineData.length > 0 && (
        <div className="timeline-container">
            {timelineData.map((data, idx) => (
                <TimelineItem data={data} key={idx} />
            ))}
        </div>
    );

export default Timeline; 