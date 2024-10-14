import requests
import json
import sys
from faker import Faker

fake = Faker()

url = "http://localhost:8000/api/exam/create"

headers = {
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBhMDk2MjEyOWM3OGU1MWE2ODYwNWUiLCJlbWFpbCI6Im5ndXllbnZhbnRlYWNoZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI4NzExMzM0LCJleHAiOjE3Mjg4ODQxMzR9.MvV_EVGf669OtyVaHKOwmSeGxcWMEkw63u_Yzz0DTlc',
    'x-client-id': '670a0962129c78e51a68605e',
    'Content-Type': 'application/json'
}

try:
    num_requests = int(sys.argv[1])
except (IndexError, ValueError):
    print("Please provide a valid number of requests.")
    sys.exit(1)


def generate_random_exam():
    start_time = fake.date_time_this_year()
    end_time = fake.date_time_this_year(after_now=True)
    return {
        "title": fake.sentence(nb_words=4),
        "description": fake.paragraph(nb_sentences=2),
        "startTime": start_time.isoformat() + "Z",
        "endTime": end_time.isoformat() + "Z",
        "status": fake.random_element(elements=("Scheduled", "In Progress", "Completed", "Cancelled")),
    }


for _ in range(num_requests):
    payload = json.dumps(generate_random_exam())
    response = requests.post(url, headers=headers, data=payload)
    print(response.text)
