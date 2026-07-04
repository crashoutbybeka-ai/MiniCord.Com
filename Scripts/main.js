// @ts-nocheck
// Your Airtable credentials
const airtableApiKey = 'pat4UX22SBMpWrSCg.a6777d168b858b0c6e09b2dd832bd38126352ace1c0198c5c44af7f70744e083';
const baseId = 'appxqk0jvILERPQd5';
const server = localStorage.getItem("current_server");

const MessagesTableName = server || "Messages";

const sfx = new Audio("../Audio/notification.mp3");
const send = new Audio("../Audio/send.mp3");
const userData = JSON.parse(localStorage.getItem("user"));
const user = userData.name || userData?.name || null;
const userTags = {
    "Beka": "[Owner]",
    "Hunter": "[Executive Moderator]",
    "Brayden": "[Moderator]",
    "Jaxson": "[Moderator]"
};

const bitSecureKey = [
  "456423",
  "123456",
  "010101"
]

const devText = document.createElement("div");

devText.style.position = "fixed";
devText.style.bottom = "10px";
devText.style.right = "10px";
devText.style.fontSize = "12px";
devText.style.color = "gray";
devText.style.fontFamily = "Comfortaa";

devText.textContent = `Google ID: ${userData.googleId}`;

document.body.appendChild(devText);

function getDisplayName(name) {
    const tag = userTags[name];

    if (tag) {
        return `${tag} ${name}`;
    }

    return name;
}
const black_listed_words = ["Epstein", "epstein", "Diddy", "diddy", "daddy", "Niger", "niger", "Niggas", "niggas", "Cum", "cum", "Fuck", "fuck", "Nigger", "nigger", "shit", "Shit", "FUCK", "YOU STUPID LITTLE MOTHER FUCKING NIGGER", "Mommy~", "slut", "hoe", "whore"];

const apiUrl = `https://api.airtable.com/v0/${baseId}/${MessagesTableName}`;

// Track message IDs to detect new messages
let lastMessageIds = new Set();

if (!user) {
    alert("You can't bug in buddy");
    window.location.href = '../Pages/SignIn.html';
}

// Function to check filtered words
function checkFilteredWords(message) {
  return black_listed_words.some(word => message.toLowerCase().includes(word.toLowerCase()));
}

// Fetch and display records, with new message detection
async function fetchAndDisplayRecords() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data || !data.records) {
      throw new Error('No records property in response.');
    }

    // Sort by createdTime (oldest first)
    data.records.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));

    // Check if table matches your specific value
    const specificTable = 'DMs'; // Replace with your actual table name

    let filteredRecords = data.records;

    if (MessagesTableName === specificTable) {
      const id_Saved = sessionStorage.getItem("id");

      if (!id_Saved) {
        const id_Choosen = prompt("Who is the user you are asking for");
        sessionStorage.setItem("id", id_Choosen);
      }

      const targetID = id_Saved;

      filteredRecords = data.records.filter(record => {
        return record.fields && record.fields['ToSender'] === targetID || user;
      });
    }

    // Detect new messages
    for (const record of filteredRecords) {
      const id = record.id;

      if (!lastMessageIds.has(id)) {
        // New message detected
        const fields = record.fields || {};
        const senderID = fields['SenderID'] || '';

        // Play sound if sender is not current user
        if (senderID !== userData.googleId) {
          sfx.play();
        }

        lastMessageIds.add(id);
      }
    }

    displayMessages(filteredRecords);

  } catch (error) {
    console.error('Failed to fetch data:', error);
    alert('Error fetching data: ' + error.message);
  }
}

// Display messages in the DOM
function displayMessages(records) {
  const container = document.getElementById('messages');
  container.innerHTML = '';

  if (records.length === 0) {
    return;
  }

  const currentUserName = user;

  records.forEach(record => {
    const fields = record.fields || {};
    const message = Object.prototype.hasOwnProperty.call(fields, 'Message') ? fields.Message : 'No message';
    const sender = Object.prototype.hasOwnProperty.call(fields, 'Sender') ? fields.Sender : 'Anonymous';
    const createdTime = record.createdTime || '';

    const isSentByUser = fields.SenderID === userData.googleId;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isSentByUser ? 'sent' : 'received');

    const textSpan = document.createElement('span');
    textSpan.textContent = `${sender}: ${message}`;
    messageDiv.appendChild(textSpan);

    if (createdTime) {
      const timeDiv = document.createElement('div');
      timeDiv.className = 'timestamp';
      timeDiv.textContent = formatTime(createdTime);
      messageDiv.appendChild(timeDiv);
    }

    container.appendChild(messageDiv);
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Handle message form submission
document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const messageInput = document.getElementById('messageField');
  const sender = getDisplayName(user);
  const id = localStorage.getItem("id");

  const message = messageInput.value.trim();
  const isbad = checkFilteredWords(message);

  if (!message) {
    alert('Please enter a message.');
    return;
  }

  if (!MessagesTableName == "DMs") {
    if (isbad == true) {
      alert("violation of TOS");
      return;
    }
  }

  if (message.startsWith("change_name_")) {
    const code = message.split(" ")[1];

    if (userData.googleId.includes(code)) {
        localStorage.removeItem("user");
        localStorage.removeItem("current_server");
        sessionStorage.clear();

        if (window.google?.accounts?.id) {
            google.accounts.id.disableAutoSelect();
        }

        window.location.href = "../Pages/SignIn.html";
    }
  }
  if (message.startsWith("emergency_reset ")) {
    const code = message.split(" ")[1];

    if (bitSecureKey.includes(code)) {
        localStorage.removeItem("user");
        localStorage.removeItem("current_server");
        sessionStorage.clear();

        if (window.google?.accounts?.id) {
            google.accounts.id.disableAutoSelect();
        }

        window.location.href = "../Pages/SignIn.html";
    }
  }
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Message: message,
          Sender: sender,
          SenderID: userData.googleId,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    messageInput.value = '';
    send.play();

    await fetchAndDisplayRecords();

  } catch (error) {
    console.error('Error adding message:', error);
    alert('Failed to add message: ' + error.message);
  }
});

setInterval(fetchAndDisplayRecords, 1000);