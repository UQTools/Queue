import { generateMailto } from "./mailto";

export const bugReportMailTo = (sender: string) => {
    const bugReportTemplate = `Hi,

I've recently encountered a bug using the Q. Here's information about the bug:
    
Describe the bug
A clear and concise description of what the bug is

To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

Expected behavior
A clear and concise description of what you expected to happen.

Screenshots
If applicable, add screenshots to help explain your problem.

Environment:
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]

Additional context:
Add any other context about the problem here.

Kind regards,
${sender}    
`;
    return generateMailto(
        "mike.pham@uq.edu.au",
        "[Queue] Bug report",
        bugReportTemplate
    );
};

export const featureRequestMailto = (sender: string) => {
    const featureRequestTemplate = `Hi,

I have a feature request regarding the Q. Here's my idea
    
Is your feature request related to a problem? Please describe.
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

Describe the solution you'd like
A clear and concise description of what you want to happen.

Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.

Additional context
Add any other context or screenshots about the feature request here.


Kind regards,
${sender}    
`;
    return generateMailto(
        "mike.pham@uq.edu.au",
        "[Queue] Feature request",
        featureRequestTemplate
    );
};
