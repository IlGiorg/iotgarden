import RPi.GPIO as GPIO
import time

# Configuration
TRIGGER_PIN = 18  # GPIO pin connected to HCW-M421 trigger input

# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIGGER_PIN, GPIO.OUT)
GPIO.output(TRIGGER_PIN, GPIO.LOW)  # Ensure trigger is low initially

try:
    while True:
        user_input = input("Enter '1' to start watering (or 'q' to quit): ")
        if user_input == '1':
            print("Triggering relay...")
            GPIO.output(TRIGGER_PIN, GPIO.HIGH)  # Send high-level signal
            time.sleep(0.5)  # Maintain signal for 0.5 seconds
            GPIO.output(TRIGGER_PIN, GPIO.LOW)   # Reset trigger
            print("Relay triggered.")
        elif user_input.lower() == 'q':
            print("Exiting program.")
            break
        else:
            print("Invalid input. Please enter '1' or 'q'.")
finally:
    GPIO.cleanup()
