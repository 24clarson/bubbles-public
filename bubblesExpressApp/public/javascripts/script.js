let activities = null;
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

function renderCalendar(year, month) {
    const calendarTitle = document.getElementById('calendar-title');
    const calendarDays = document.getElementById('calendar-days');
    // Update title
    const monthNames = [
      'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;

    // Clear previous days
    calendarDays.innerHTML = '';

    // Get first day of the month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.classList.add('day', 'empty');
      calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.id = "day" + String(day);
        if (activities) {
            for (act of activities) {
                mn = String(month)
                if (mn.length == 1) {
                    mn = "0" + mn
                }
                dy = String(day)
                if (dy.length == 1) {
                    dy = "0" + dy
                }
                if (act.start_date.slice(0,10) == year + "-" + mn + "-" + dy) {
                    console.log(year + "-" + mn + "-" + dy)
                    dayDiv.appendChild(makeBubble(act));
                }
            }   
        }
        // dayDiv.textContent = day;
        calendarDays.appendChild(dayDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
  
    // Initial render
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;
    renderCalendar(currentYear, currentMonth);
  
    // Update calendar on change
    yearSelect.addEventListener('change', () => {
      renderCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
  
    monthSelect.addEventListener('change', () => {
      renderCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
});

const clientId = '142021';
const redirectUri = "https://bubbles-vyp2.onrender.com/";
const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all,read_all&approval_prompt=auto`;

document.getElementById('auth').href = authUrl;

const params = new URLSearchParams(window.location.search);
const authorizationCode = params.get('code'); // Get the "code" parameter

if (authorizationCode) {
    console.log('Authorization Code:', authorizationCode);

    // Exchange the authorization code for an access token
    requestAccessToken(authorizationCode);
}

async function requestAccessToken(authorizationCode) {
    try {
        const response = await fetch('/fetchAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                code: authorizationCode,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch access token: ${response.status}`);
        }

        const data = await response.json();
        console.log('Access Token:', data.access_token);

        // Fetch user activity data
        fetchActivities(data.access_token);
    } catch (error) {
        console.error('Error requesting access token:', error);
    }
}

async function fetchActivities(accessToken) {
    try {
        const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch activities: ${response.status}`);
        }

        activities = await response.json();
        console.log('User Activities:', activities);
        processActivities(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

function processActivities(activitiesList) {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;
    renderCalendar(currentYear, currentMonth);
}

function makeBubble(act) {
    bubble = document.createElement("div")
    bubble.style.width = 117*(1/(1+(2.718**(-act.moving_time/60/90)))-1/6) + "px";
    bubble.style.height = 117*(1/(1+(2.718**(-act.moving_time/60/90)))-1/6) + "px";
    bubble.style.borderRadius = "50%";
    bubble.style.backgroundColor = "lightgreen";
    bubble.style.display = "flex";
    bubble.style.alignItems = "center";
    bubble.style.justifyContent = "center";
    bubble.style.color = "black";
    bubble.innerHTML = (act.distance/1609.344).toFixed(1) + " mi";
    return bubble
}
