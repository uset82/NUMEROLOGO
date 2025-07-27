#!/usr/bin/env python3
"""
Calculadora del Pináculo Numerológico
Based on the exact formulas from numerologia-cotidiana.com
"""

def calculate_pinaculo(birth_date, full_name):
    """
    Calculate Pináculo numbers using the exact competitor formulas
    
    Args:
        birth_date: string in format "DD/MM/YYYY"
        full_name: string with full name
    
    Returns:
        dict with all calculated values
    """
    
    # Parse birth date
    day, month, year = birth_date.split('/')
    day = int(day)
    month = int(month)
    year = int(year)
    
    print(f"=== CÁLCULO DEL PINÁCULO PARA {full_name} ===")
    print(f"Fecha de nacimiento: {birth_date}")
    print()
    
    # Reduce year to single digit (sum digits until single digit)
    def reduce_to_single_digit(num):
        while num > 9:
            num = sum(int(digit) for digit in str(num))
        return num
    
    # Basic values
    A = month  # MES
    B = day if day <= 9 else reduce_to_single_digit(day)  # DÍA
    C = reduce_to_single_digit(year)  # AÑO
    
    print("=== NÚMEROS BASE ===")
    print(f"A (MES): {A}")
    print(f"B (DÍA): {B}")  
    print(f"C (AÑO): {C}")
    print()
    
    # NÚMEROS POSITIVOS
    print("=== NÚMEROS POSITIVOS ===")
    
    D = reduce_to_single_digit(A + B + C)
    print(f"D (A+B+C): {A}+{B}+{C} = {D}")
    
    E = reduce_to_single_digit(A + B)
    print(f"E (A+B): {A}+{B} = {E}")
    
    F = reduce_to_single_digit(B + C)
    print(f"F (B+C): {B}+{C} = {F}")
    
    G = reduce_to_single_digit(E + F)
    print(f"G (E+F): {E}+{F} = {G}")
    
    I = reduce_to_single_digit(E + F + G)
    print(f"I (E+F+G): {E}+{F}+{G} = {I}")
    
    H = reduce_to_single_digit(A + C)
    print(f"H (A+C): {A}+{C} = {H}")
    
    J = reduce_to_single_digit(D + H)
    print(f"J (D+H): {D}+{H} = {J}")
    
    X = reduce_to_single_digit(B + D)
    print(f"X (B+D): {B}+{D} = {X}")
    
    Y = reduce_to_single_digit(A + B + C + D + X)
    print(f"Y (A+B+C+D+X): {A}+{B}+{C}+{D}+{X} = {Y}")
    
    print()
    
    # NÚMEROS NEGATIVOS
    print("=== NÚMEROS NEGATIVOS ===")
    
    K = abs(A - B)
    print(f"K (|A-B|): |{A}-{B}| = {K}")
    
    L = abs(B - C)
    print(f"L (|B-C|): |{B}-{C}| = {L}")
    
    M = abs(K - L) if K != L else reduce_to_single_digit(K + L)
    print(f"M (|K-L|): |{K}-{L}| = {M}")
    
    O = reduce_to_single_digit(M + K + L)
    print(f"O (M+K+L): {M}+{K}+{L} = {O}")
    
    N = abs(A - C)
    print(f"N (|A-C|): |{A}-{C}| = {N}")
    
    P = reduce_to_single_digit(D + O)
    print(f"P (D+O): {D}+{O} = {P}")
    
    Q = reduce_to_single_digit(K + M)
    print(f"Q (K+M): {K}+{M} = {Q}")
    
    R = reduce_to_single_digit(L + M)
    print(f"R (L+M): {L}+{M} = {R}")
    
    S = reduce_to_single_digit(Q + R)
    print(f"S (Q+R): {Q}+{R} = {S}")
    
    print()
    
    # Calculate letter values for name (Chaldean system from competitor)
    def get_letter_value(letter):
        """Chaldean numerology system"""
        letter = letter.upper()
        chaldean = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
            'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
            'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
        }
        return chaldean.get(letter, 0)
    
    # Calculate name numbers
    print("=== NÚMEROS DEL NOMBRE ===")
    
    # Remove spaces and get only letters
    clean_name = ''.join(c for c in full_name.upper() if c.isalpha())
    name_total = sum(get_letter_value(letter) for letter in clean_name)
    name_number = reduce_to_single_digit(name_total)
    
    print(f"Nombre: {full_name}")
    print(f"Letras: {' '.join(clean_name)}")
    print(f"Valores: {' '.join(str(get_letter_value(c)) for c in clean_name)}")
    print(f"Suma total: {name_total}")
    print(f"Número del nombre: {name_number}")
    
    # Vowels (Alma)
    vowels = ''.join(c for c in clean_name if c in 'AEIOU')
    vowel_total = sum(get_letter_value(letter) for letter in vowels)
    alma_number = reduce_to_single_digit(vowel_total)
    
    print(f"Vocales: {' '.join(vowels)}")
    print(f"Suma vocales: {vowel_total}")
    print(f"Número del Alma: {alma_number}")
    
    # Consonants (Personalidad)  
    consonants = ''.join(c for c in clean_name if c.isalpha() and c not in 'AEIOU')
    consonant_total = sum(get_letter_value(letter) for letter in consonants)
    personality_number = reduce_to_single_digit(consonant_total)
    
    print(f"Consonantes: {' '.join(consonants)}")
    print(f"Suma consonantes: {consonant_total}")
    print(f"Número de Personalidad: {personality_number}")
    
    print()
    
    # REGALO DIVINO (Z)
    Z = reduce_to_single_digit(int(str(year)[-2:]))  # Last two digits of birth year
    print(f"=== REGALO DIVINO ===")
    print(f"Z (últimos 2 dígitos del año): {str(year)[-2:]} = {Z}")
    
    print()
    
    # Summary
    print("=== RESUMEN COMPLETO ===")
    print(f"MI ESENCIA (B - Día): {B}")
    print(f"MI MISIÓN (D - Destino): {D}")
    print(f"MI ALMA (Vocales): {alma_number}")
    print(f"MI PERSONALIDAD (Consonantes): {personality_number}")
    print(f"MI NÚMERO PERSONAL (Nombre completo): {name_number}")
    print(f"REGALO DIVINO (Z): {Z}")
    
    return {
        'base_numbers': {'A': A, 'B': B, 'C': C},
        'positive_numbers': {'D': D, 'E': E, 'F': F, 'G': G, 'H': H, 'I': I, 'J': J, 'X': X, 'Y': Y},
        'negative_numbers': {'K': K, 'L': L, 'M': M, 'N': N, 'O': O, 'P': P, 'Q': Q, 'R': R, 'S': S},
        'name_numbers': {
            'alma': alma_number,
            'personality': personality_number, 
            'name_total': name_number
        },
        'regalo_divino': Z,
        'summary': {
            'esencia': B,
            'mision': D,
            'alma': alma_number,
            'personalidad': personality_number,
            'numero_personal': name_number,
            'regalo_divino': Z
        }
    }

if __name__ == "__main__":
    # Test with Carlos Carpio
    result = calculate_pinaculo("06/05/1982", "CARLOS CARPIO")
    
    print("\n" + "="*50)
    print("PARA COMPARAR CON https://numerologia-cotidiana.com/#mapa")
    print("="*50)
