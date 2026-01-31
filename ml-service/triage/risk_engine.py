def calculate_risk(probability):
    """
    Returns Triage Level based on risk probability.
    > 80%  -> HIGH
    40-80% -> MODERATE
    < 40%  -> LOW
    """
    if probability >= 0.80:
        return "HIGH"
    elif probability >= 0.40:
        return "MODERATE"
    else:
        return "LOW"
