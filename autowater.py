import RPi.GPIO as GPIO
import time

# GPIO pin setup
MOISTURE_SENSOR_PIN = 14  # TXD0
RELAY_PIN = 8

# GPIO setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(MOISTURE_SENSOR_PIN, GPIO.IN)
GPIO.setup(RELAY_PIN, GPIO.OUT)

# Ensure relay is off initially
GPIO.output(RELAY_PIN, GPIO.HIGH)  # HIGH = OFF if relay is active-low

try:
    print("Moisture monitoring started. Press Ctrl+C to stop.")
    while True:
        moisture = GPIO.input(MOISTURE_SENSOR_PIN)
        
        if moisture == 0:
            print("Soil is dry. Turning ON relay (watering).")
            GPIO.output(RELAY_PIN, GPIO.LOW)
        else:
            print("Soil is wet. Turning OFF relay.")
            GPIO.output(RELAY_PIN, GPIO.HIGH)

        time.sleep(2)

except KeyboardInterrupt:
    print("Exiting gracefully...")

finally:
    GPIO.output(RELAY_PIN, GPIO.HIGH)
    GPIO.cleanup()
