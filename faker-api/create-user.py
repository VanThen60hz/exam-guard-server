import requests
import json
from faker import Faker
import sys

fake = Faker()

url = "http://localhost:8000/api/user/create"


headers = {
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBhMDkzZDEyOWM3OGU1MWE2ODYwNTgiLCJlbWFpbCI6Im5ndXllbnZhbmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI4NzEwOTczLCJleHAiOjE3Mjg4ODM3NzN9.zLTh0KBVZW0M4Ktz7hd3cP0wXm8Va2TqIrK4v3rOCJk',
    'x-client-id': '670a093d129c78e51a686058',
    'Content-Type': 'application/json'
}

try:
    num_requests = int(sys.argv[1])
except (IndexError, ValueError):
    print("Please provide a valid number of requests.")
    sys.exit(1)


password = "securepassword123"


def generate_random_user():
    return {
        "username": fake.user_name(),
        "name": fake.name(),
        "email": fake.email(),
        "password": password,
        "role": fake.random_element(elements=("STUDENT", "TEACHER")),
        "gender": fake.random_element(elements=("MALE", "FEMALE")),
        "dob": fake.date_of_birth(minimum_age=18, maximum_age=65).strftime("%Y-%m-%d"),
        "phone_number": fake.phone_number(),
        "ssn": fake.random_number(digits=10),
        "address": fake.address(),
        "status": fake.random_element(elements=("ACTIVE", "INACTIVE", "SUSPENDED")),
    }


for _ in range(num_requests):
    payload = json.dumps(generate_random_user())
    response = requests.post(url, headers=headers, data=payload)
    print(response.text)
