import requests
import json
from faker import Faker
import sys

fake = Faker()

url = "https://exam-guard-server.onrender.com/api/user/create"


headers = {
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJhM2U2ZTFmMzJjOTI5Yjg0OTg5MmQiLCJlbWFpbCI6Im5ndXllbnZhbmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMwODIyMjk3LCJleHAiOjE3MzEyNTQyOTd9.GYT8wLIbMDSfSl9wSXbRJm3v7umdiV1tcKdbmOWy1nY',
    'x-client-id': '672a3e6e1f32c929b849892d',
    'Content-Type': 'application/json'
}

try:
    num_requests = int(sys.argv[1])
except (IndexError, ValueError):
    print("Please provide a valid number of requests.")
    sys.exit(1)


password = "123"


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
