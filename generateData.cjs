const { faker } = require('@faker-js/faker');
const fs = require('fs');


const taskCategories = ['Personal', 'Work', 'Health', 'Finance', 'Education', 'Home', 'Shopping', 'Social', 'Travel', 'Hobby'];
const priorities = ['Low', 'Medium', 'High'];

const taskTemplates = {
  Personal: [
    'Call Priya', 'Buy gift for Amit', 'Plan weekend activities', 'Organize family photos',
    'Write in journal', 'Meditate for 30 minutes', 'Try new recipe for dinner',
    'Read "The Great Gatsby" for 1 hour', 'Create a vision board', 'Update personal blog'
  ],
  Work: [
    'Prepare for meeting with Rajesh', 'Submit Q2 report', 'Follow up with client Sunita', 
    'Update project timeline', 'Conduct performance review for Neha', 'Brainstorm ideas for new app',
    'Organize desk and files', 'Attend webinar on digital marketing', 'Update LinkedIn profile',
    'Create presentation for client pitch'
  ],
  Health: [
    'Schedule dentist appointment', 'Go for a 30-minute run', 'Meal prep for the week', 
    'Meditate for 20 minutes', 'Track water intake', 'Try new vegetarian recipe',
    'Schedule annual check-up', 'Research wellness for better health', 'Get a massage',
    'Track sleep patterns for a week'
  ],
  Finance: [
    'Pay electricity bill', 'Review monthly budget', 'Research investment options', 'File income tax documents',
    'Set up automatic savings transfer', 'Compare insurance quotes', 'Create retirement savings plan',
    'Negotiate salary for new position', 'Sell unused items online', 'Track expenses for a month'
  ],
  Education: [
    'Study for Maths exam', 'Complete online course module on Python', 'Research AI for project', 
    'Practice tabla for 1 hour', 'Attend History lecture', 'Teach coding to Ayesha',
    'Read academic paper on artificial intelligence', 'Prepare for certification exam in data science', 'Join study group for Chemistry',
    'Create flashcards for Biology'
  ],
  Home: [
    'Clean the kitchen', 'Fix leaky faucet', 'Declutter closet', 'Water plants',
    'Organize garage', 'Plan home renovation project', 'Research energy-saving appliances',
    'Create a chore schedule', 'Deep clean refrigerator', 'Start a compost bin'
  ],
  Shopping: [
    'Buy groceries', 'Order new smartphone', 'Compare prices for laptop', 'Return shoes to store',
    'Create shopping list for Diwali', 'Research eco-friendly product alternatives',
    'Buy birthday gift for Rani', 'Stock up on household essentials', 'Browse local markets',
    'Find deals for TV'
  ],
  Social: [
    'Plan Holi party', 'RSVP to Neha\'s wedding invitation', 'Catch up with Ankit', 'Organize group outing',
    'Join local yoga club', 'Volunteer at community event', 'Host dinner party for friends',
    'Attend networking event for tech industry', 'Plan game night with friends', 'Organize family reunion'
  ],
  Travel: [
    'Book flights to Goa', 'Renew passport', 'Research hotels in Jaipur', 
    'Create packing list for trip to Kerala', 'Learn basic phrases in Hindi', 'Get travel insurance',
    'Plan itinerary for Ladakh trip', 'Research local customs in Delhi',
    'Break in new hiking boots for trip', 'Get necessary vaccinations for Sri Lanka'
  ],
  Hobby: [
    'Practice painting for 2 hours', 'Sign up for cooking class', 'Buy supplies for pottery project', 
    'Watch tutorial on traditional dance', 'Join online community for photography', 'Participate in art exhibition',
    'Start a blog about trekking', 'Teach guitar to Raj', 'Attend photography workshop',
    'Explore new techniques in watercolor painting'
  ],
  Technology: [
    'Update software on laptop', 'Back up data from phone', 'Research new smartphone',
    'Troubleshoot Wi-Fi issues', 'Set up smart home devices', 'Learn about cybersecurity',
    'Optimize computer performance', 'Secure online accounts with 2FA', 'Declutter digital files',
    'Create tech support guide for family'
  ],
  Development: [
    'Debug login feature in app', 'Refactor user profile component for better performance',
    'Write unit tests for API module', 'Optimize database queries in e-commerce project',
    'Implement Singleton pattern in Java', 'Code review for Aarav\'s pull request',
    'Set up CI/CD pipeline for web app', 'Learn new framework: React',
    'Contribute to open-source project: Django', 'Optimize sorting algorithm complexity',
    'Document API for payment service', 'Implement OAuth2 in project',
    'Containerize chat application using Docker', 'Profile and optimize chat application performance',
    'Implement responsive design for company website', 'Migrate user database to new schema'
  ],
  Career: [
    'Update resume', 'Prepare for job interview with Infosys', 'Network with IT professionals',
    'Set up informational interview with Meera', 'Research salary trends in tech industry',
    'Create portfolio website', 'Seek mentorship from Rajesh in software engineering',
    'Identify skills to develop for career growth', 'Practice public speaking',
    'Write article on AI advancements for LinkedIn'
  ]
};


function generateRealisticTitle(category) {
  let title = faker.helpers.arrayElement(taskTemplates[category]);
  title = title.replace('{name}', faker.person.firstName());
  title = title.replace('{document}', faker.word.noun());
  title = title.replace('{duration}', faker.helpers.arrayElement(['15 minutes', '30 minutes', '1 hour', '2 hours']));
  title = title.replace('{bill}', faker.helpers.arrayElement(['electricity', 'water', 'internet', 'phone', 'credit card']));
  title = title.replace('{subject}', faker.helpers.arrayElement(['math', 'history', 'science', 'literature', 'economics']));
  title = title.replace('{topic}', faker.word.noun());
  title = title.replace('{instrument}', faker.helpers.arrayElement(['piano', 'guitar', 'violin', 'drums', 'flute']));
  title = title.replace('{room}', faker.helpers.arrayElement(['kitchen', 'bathroom', 'bedroom', 'living room', 'garage']));
  title = title.replace('{item}', faker.commerce.product());
  title = title.replace('{event}', faker.helpers.arrayElement(['birthday', 'graduation', 'anniversary', 'holiday']));
  title = title.replace('{destination}', faker.location.city());
  title = title.replace('{hobby}', faker.helpers.arrayElement(['painting', 'photography', 'gardening', 'cooking', 'woodworking']));
  return title;
}

function generateRealisticDescription(title, category) {
  return `${category} task: ${title}. ${faker.lorem.sentence()}`;
}

function generateTaskData(numTasks = 10000) {
  const tasks = [];
  for (let i = 0; i < numTasks; i++) {
    const category = faker.helpers.arrayElement(taskCategories);
    const title = generateRealisticTitle(category);
    const creationDate = faker.date.recent({ days: 30 });
    const dueDate = faker.date.soon({ days: 30, refDate: creationDate });
    const status = faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed', 'On Hold']);
    const completionDate = status === 'Completed' ? faker.date.between({ from: creationDate, to: dueDate }) : null;

    const task = {
      id: i,
      title: title,
      description: generateRealisticDescription(title, category),
      category: category,
      priority: faker.helpers.arrayElement(priorities),
      user_id: faker.number.int({ min: 1, max: 100 }),
      creation_date: creationDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      completion_date: completionDate ? completionDate.toISOString().split('T')[0] : null,
      status: status,
    };
    tasks.push(task);
  }
  return tasks;
}

const taskData = generateTaskData();
fs.writeFileSync('realistic_user_tasks.json', JSON.stringify(taskData, null, 2));

console.log(`Generated ${taskData.length} realistic user tasks.`);