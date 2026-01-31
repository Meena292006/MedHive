from .notifications import notify_doctor, notify_nurse, send_self_care_advice

def route_patient(risk, patient_name, symptoms=None):
    """
    Automated triage routing logic.
    """
    if risk == "HIGH":
        # Pass symptoms to notification for the Twilio call message
        reason = symptoms[0] if symptoms else "Medical Emergency"
        return notify_doctor(patient_name, reason=reason, symptoms=symptoms)
    elif risk == "MODERATE":
        return notify_nurse(patient_name)
    else:
        return send_self_care_advice(patient_name)
