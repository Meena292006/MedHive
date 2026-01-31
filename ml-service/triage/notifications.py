from .call_service import call_service

def notify_doctor(patient_name, reason="Medical Emergency", symptoms=None):
    msg = f"🚨 EMERGENCY: Initiating Call to Doctor for {patient_name}"
    print(msg)
    
    # Trigger the real Twilio call service
    call_service.make_emergency_call(reason, symptoms or [reason])
    
    return msg

def notify_nurse(patient_name):
    msg = f"📢 URGENT: Alerting Nurse for {patient_name}"
    print(msg)
    return msg

def send_self_care_advice(patient_name):
    msg = f"✅ STABLE: Sending self-care advice to {patient_name}"
    print(msg)
    return msg
