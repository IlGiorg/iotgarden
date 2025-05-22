import RPi.GPIO as GPIO
import time

RELAY_PIN = 18  # Use the pin your relay is connected to
WATERING_DURATION = 5  # in seconds

# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)

try:
    while True:
        choice = input("Enter 1 to start watering (or q to quit): ")

        if choice == '1':
            print("Watering plants...")
            GPIO.output(RELAY_PIN, GPIO.HIGH)  # or GPIO.LOW for active-low relay
            time.sleep(WATERING_DURATION)
            GPIO.output(RELAY_PIN, GPIO.LOW)   # or GPIO.HIGH if LOW is on
            print("Done watering.\n")

        elif choice.lower() == 'q':
            print("Exiting...")
            break

        else:
            print("Invalid input. Enter '1' or 'q'.\n")

finally:
    GPIO.cleanup()
