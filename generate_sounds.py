"""
OMSI 2 Mercedes Benz O345 İETT Istanbul V3 Sound Mod Generator
Generates synthetic engine, kickdown, and ZF EcoAMT transmission sounds.
"""

import struct
import math
import os
import random

SAMPLE_RATE = 44100
CHANNELS = 1
BITS_PER_SAMPLE = 16

def write_wav(filename, samples, sample_rate=SAMPLE_RATE):
    """Write PCM samples to a WAV file."""
    num_samples = len(samples)
    data_size = num_samples * 2
    file_size = 36 + data_size

    with open(filename, 'wb') as f:
        # RIFF header
        f.write(b'RIFF')
        f.write(struct.pack('<I', file_size))
        f.write(b'WAVE')
        # fmt chunk
        f.write(b'fmt ')
        f.write(struct.pack('<I', 16))  # chunk size
        f.write(struct.pack('<H', 1))   # PCM
        f.write(struct.pack('<H', CHANNELS))
        f.write(struct.pack('<I', sample_rate))
        f.write(struct.pack('<I', sample_rate * CHANNELS * 2))
        f.write(struct.pack('<H', CHANNELS * 2))
        f.write(struct.pack('<H', BITS_PER_SAMPLE))
        # data chunk
        f.write(b'data')
        f.write(struct.pack('<I', data_size))
        for s in samples:
            clamped = max(-32768, min(32767, int(s)))
            f.write(struct.pack('<h', clamped))


def generate_engine_idle(duration=3.0):
    """Generate Mercedes OM447 diesel idle sound (~700 RPM)."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    base_freq = 35.0  # ~700 RPM / 60 * 3 cylinders firing
    for i in range(n):
        t = i / SAMPLE_RATE
        # Main combustion rumble
        s = 0.5 * math.sin(2 * math.pi * base_freq * t)
        # Harmonics for diesel character
        s += 0.3 * math.sin(2 * math.pi * base_freq * 2 * t)
        s += 0.15 * math.sin(2 * math.pi * base_freq * 3 * t)
        s += 0.08 * math.sin(2 * math.pi * base_freq * 5 * t)
        # Turbo whine
        s += 0.04 * math.sin(2 * math.pi * 280 * t)
        # Injector tick
        s += 0.06 * math.sin(2 * math.pi * base_freq * 6 * t) * (0.5 + 0.5 * math.sin(2 * math.pi * 11.67 * t))
        # Noise
        s += 0.03 * (random.random() * 2 - 1)
        samples.append(s * 20000)
    return samples


def generate_engine_low_rpm(duration=3.0):
    """Generate engine sound at ~1200 RPM."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    base_freq = 60.0
    for i in range(n):
        t = i / SAMPLE_RATE
        s = 0.5 * math.sin(2 * math.pi * base_freq * t)
        s += 0.35 * math.sin(2 * math.pi * base_freq * 2 * t)
        s += 0.2 * math.sin(2 * math.pi * base_freq * 3 * t)
        s += 0.12 * math.sin(2 * math.pi * base_freq * 4 * t)
        s += 0.06 * math.sin(2 * math.pi * 450 * t)  # turbo
        s += 0.04 * (random.random() * 2 - 1)
        samples.append(s * 22000)
    return samples


def generate_engine_mid_rpm(duration=3.0):
    """Generate engine sound at ~1800 RPM - cruising."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    base_freq = 90.0
    for i in range(n):
        t = i / SAMPLE_RATE
        s = 0.45 * math.sin(2 * math.pi * base_freq * t)
        s += 0.35 * math.sin(2 * math.pi * base_freq * 2 * t)
        s += 0.25 * math.sin(2 * math.pi * base_freq * 3 * t)
        s += 0.15 * math.sin(2 * math.pi * base_freq * 4 * t)
        s += 0.08 * math.sin(2 * math.pi * base_freq * 6 * t)
        # Stronger turbo whine
        s += 0.08 * math.sin(2 * math.pi * 680 * t)
        s += 0.03 * math.sin(2 * math.pi * 1360 * t)
        s += 0.05 * (random.random() * 2 - 1)
        samples.append(s * 22000)
    return samples


def generate_engine_high_rpm(duration=3.0):
    """Generate engine sound at ~2200 RPM - full power."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    base_freq = 110.0
    for i in range(n):
        t = i / SAMPLE_RATE
        s = 0.4 * math.sin(2 * math.pi * base_freq * t)
        s += 0.35 * math.sin(2 * math.pi * base_freq * 2 * t)
        s += 0.28 * math.sin(2 * math.pi * base_freq * 3 * t)
        s += 0.18 * math.sin(2 * math.pi * base_freq * 4 * t)
        s += 0.1 * math.sin(2 * math.pi * base_freq * 5 * t)
        s += 0.06 * math.sin(2 * math.pi * base_freq * 7 * t)
        # Strong turbo
        s += 0.1 * math.sin(2 * math.pi * 900 * t)
        s += 0.05 * math.sin(2 * math.pi * 1800 * t)
        s += 0.06 * (random.random() * 2 - 1)
        samples.append(s * 24000)
    return samples


def generate_kickdown(duration=4.0):
    """Generate kickdown sound - dramatic RPM rise with turbo spool."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # RPM rises from 1200 to 2400
        rpm_freq = 60 + 60 * progress
        # Exponential turbo spool
        turbo_intensity = 0.02 + 0.15 * (progress ** 2)
        turbo_freq = 500 + 1200 * progress

        s = 0.45 * math.sin(2 * math.pi * rpm_freq * t)
        s += 0.35 * math.sin(2 * math.pi * rpm_freq * 2 * t)
        s += 0.25 * math.sin(2 * math.pi * rpm_freq * 3 * t)
        s += 0.15 * math.sin(2 * math.pi * rpm_freq * 4 * t)
        s += 0.1 * math.sin(2 * math.pi * rpm_freq * 5 * t)
        # Turbo spool-up
        s += turbo_intensity * math.sin(2 * math.pi * turbo_freq * t)
        # Exhaust burble
        s += 0.08 * math.sin(2 * math.pi * rpm_freq * 0.5 * t) * progress
        # Volume increase
        volume = 0.7 + 0.3 * progress
        s += 0.06 * (random.random() * 2 - 1)
        samples.append(s * volume * 26000)
    return samples


def generate_zf_shift_up(duration=1.5):
    """Generate ZF EcoAMT upshift sound - brief RPM drop with gear engage clunk."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # RPM drops during shift
        if progress < 0.3:
            rpm_freq = 100 - 30 * (progress / 0.3)
        elif progress < 0.5:
            rpm_freq = 70
            # Gear clunk at engagement point
        else:
            rpm_freq = 70 + 20 * ((progress - 0.5) / 0.5)

        s = 0.4 * math.sin(2 * math.pi * rpm_freq * t)
        s += 0.3 * math.sin(2 * math.pi * rpm_freq * 2 * t)
        s += 0.15 * math.sin(2 * math.pi * rpm_freq * 3 * t)

        # Gear engagement clunk
        if 0.28 < progress < 0.35:
            clunk_t = (progress - 0.28) / 0.07
            clunk = 0.4 * math.exp(-clunk_t * 8) * math.sin(2 * math.pi * 200 * t)
            s += clunk

        # Synchro whine
        if 0.1 < progress < 0.5:
            s += 0.05 * math.sin(2 * math.pi * 1500 * t) * math.exp(-3 * abs(progress - 0.3))

        volume = 0.6 + 0.2 * math.sin(math.pi * progress)
        s += 0.04 * (random.random() * 2 - 1)
        samples.append(s * volume * 22000)
    return samples


def generate_zf_shift_down(duration=1.5):
    """Generate ZF EcoAMT downshift sound - RPM blip with gear engage."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # RPM blip up during downshift
        if progress < 0.2:
            rpm_freq = 70
        elif progress < 0.5:
            blip = (progress - 0.2) / 0.3
            rpm_freq = 70 + 40 * blip
        else:
            settle = (progress - 0.5) / 0.5
            rpm_freq = 110 - 20 * settle

        s = 0.45 * math.sin(2 * math.pi * rpm_freq * t)
        s += 0.32 * math.sin(2 * math.pi * rpm_freq * 2 * t)
        s += 0.18 * math.sin(2 * math.pi * rpm_freq * 3 * t)

        # Gear clunk
        if 0.45 < progress < 0.55:
            clunk_t = (progress - 0.45) / 0.1
            clunk = 0.5 * math.exp(-clunk_t * 10) * math.sin(2 * math.pi * 180 * t)
            s += clunk

        s += 0.04 * (random.random() * 2 - 1)
        samples.append(s * 23000)
    return samples


def generate_air_brake(duration=2.0):
    """Generate pneumatic air brake release sound."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # White noise shaped as air release
        noise = random.random() * 2 - 1
        # Band-pass around 2-6kHz for hiss character
        s = noise * 0.5
        s *= math.exp(-progress * 3)  # Decay
        # Add some tonal component
        s += 0.1 * math.sin(2 * math.pi * 3000 * t) * math.exp(-progress * 4)
        s += 0.05 * math.sin(2 * math.pi * 5000 * t) * math.exp(-progress * 5)
        samples.append(s * 18000)
    return samples


def generate_door_open(duration=1.5):
    """Generate pneumatic door open sound."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # Air hiss
        noise = random.random() * 2 - 1
        s = noise * 0.3 * math.exp(-progress * 2)
        # Mechanical slide
        if 0.1 < progress < 0.8:
            s += 0.1 * math.sin(2 * math.pi * 120 * t) * (1 - abs(progress - 0.45) / 0.35)
        # Thunk at end
        if 0.75 < progress < 0.85:
            thunk_t = (progress - 0.75) / 0.1
            s += 0.3 * math.exp(-thunk_t * 15) * math.sin(2 * math.pi * 80 * t)
        samples.append(s * 16000)
    return samples


def generate_door_close(duration=1.2):
    """Generate pneumatic door close sound."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        noise = random.random() * 2 - 1
        s = noise * 0.25 * math.exp(-progress * 2.5)
        if 0.05 < progress < 0.6:
            s += 0.12 * math.sin(2 * math.pi * 140 * t) * (1 - abs(progress - 0.3) / 0.3)
        # Harder thunk/seal
        if 0.55 < progress < 0.7:
            thunk_t = (progress - 0.55) / 0.15
            s += 0.4 * math.exp(-thunk_t * 12) * math.sin(2 * math.pi * 90 * t)
        samples.append(s * 18000)
    return samples


def generate_horn(duration=1.5):
    """Generate bus horn sound - dual-tone."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # Dual-tone horn
        s = 0.5 * math.sin(2 * math.pi * 420 * t)
        s += 0.4 * math.sin(2 * math.pi * 520 * t)
        s += 0.15 * math.sin(2 * math.pi * 840 * t)
        s += 0.1 * math.sin(2 * math.pi * 1040 * t)
        # Attack/release envelope
        if progress < 0.05:
            env = progress / 0.05
        elif progress > 0.9:
            env = (1 - progress) / 0.1
        else:
            env = 1.0
        s += 0.02 * (random.random() * 2 - 1)
        samples.append(s * env * 28000)
    return samples


def generate_turbo_blowoff(duration=1.0):
    """Generate turbo blow-off / wastegate sound."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # Descending whistle
        freq = 3000 * math.exp(-progress * 4)
        s = 0.3 * math.sin(2 * math.pi * freq * t)
        # Noise burst
        noise = random.random() * 2 - 1
        s += noise * 0.4 * math.exp(-progress * 5)
        # Flutter
        s *= (1 + 0.3 * math.sin(2 * math.pi * 25 * t))
        samples.append(s * 16000)
    return samples


def generate_starter(duration=2.5):
    """Generate engine starter/cranking sound."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    crank_freq = 8.0  # cranking cycles per second
    for i in range(n):
        t = i / SAMPLE_RATE
        progress = t / duration
        # Starter motor whine
        s = 0.3 * math.sin(2 * math.pi * 180 * t)
        s += 0.15 * math.sin(2 * math.pi * 360 * t)
        # Cranking compression pulses
        crank_phase = (t * crank_freq) % 1.0
        if crank_phase < 0.3:
            s += 0.4 * math.sin(math.pi * crank_phase / 0.3)
        # Speed increases as engine catches
        if progress > 0.7:
            catch = (progress - 0.7) / 0.3
            s += catch * 0.3 * math.sin(2 * math.pi * 35 * t)
            s += catch * 0.2 * math.sin(2 * math.pi * 70 * t)
        s += 0.05 * (random.random() * 2 - 1)
        samples.append(s * 20000)
    return samples


def generate_melodic_chime(duration=2.0):
    """Generate melodic door/departure chime sound."""
    n = int(SAMPLE_RATE * duration)
    samples = []
    # Three-note chime: C5, E5, G5
    notes = [(523.25, 0.0, 0.6), (659.25, 0.3, 0.6), (783.99, 0.6, 0.8)]
    for i in range(n):
        t = i / SAMPLE_RATE
        s = 0.0
        for freq, start, note_dur in notes:
            if t >= start:
                nt = t - start
                if nt < note_dur:
                    env = math.exp(-nt * 3)
                    s += 0.3 * math.sin(2 * math.pi * freq * nt) * env
                    s += 0.1 * math.sin(2 * math.pi * freq * 2 * nt) * env * 0.5
        samples.append(s * 24000)
    return samples


def main():
    base = "/home/ubuntu/repos/emirhan-memis/omsi2-mod/OMSI2_MB_O345_IETT_V3_Sound/Sound"

    print("Generating OMSI 2 Mercedes Benz O345 İETT Sound Mod...")

    # Engine sounds
    print("  - Engine idle...")
    write_wav(f"{base}/engine/engine_idle.wav", generate_engine_idle(3.0))
    print("  - Engine low RPM...")
    write_wav(f"{base}/engine/engine_low_rpm.wav", generate_engine_low_rpm(3.0))
    print("  - Engine mid RPM...")
    write_wav(f"{base}/engine/engine_mid_rpm.wav", generate_engine_mid_rpm(3.0))
    print("  - Engine high RPM...")
    write_wav(f"{base}/engine/engine_high_rpm.wav", generate_engine_high_rpm(3.0))
    print("  - Kickdown...")
    write_wav(f"{base}/engine/kickdown.wav", generate_kickdown(4.0))
    print("  - Turbo blow-off...")
    write_wav(f"{base}/engine/turbo_blowoff.wav", generate_turbo_blowoff(1.0))
    print("  - Engine starter...")
    write_wav(f"{base}/engine/engine_starter.wav", generate_starter(2.5))

    # Transmission sounds
    print("  - ZF EcoAMT shift up...")
    write_wav(f"{base}/transmission/zf_shift_up.wav", generate_zf_shift_up(1.5))
    print("  - ZF EcoAMT shift down...")
    write_wav(f"{base}/transmission/zf_shift_down.wav", generate_zf_shift_down(1.5))

    # Misc sounds
    print("  - Air brake...")
    write_wav(f"{base}/misc/air_brake.wav", generate_air_brake(2.0))
    print("  - Door open...")
    write_wav(f"{base}/misc/door_open.wav", generate_door_open(1.5))
    print("  - Door close...")
    write_wav(f"{base}/misc/door_close.wav", generate_door_close(1.2))
    print("  - Horn...")
    write_wav(f"{base}/misc/horn.wav", generate_horn(1.5))
    print("  - Melodic chime...")
    write_wav(f"{base}/misc/melodic_chime.wav", generate_melodic_chime(2.0))

    print("All sounds generated successfully!")


if __name__ == "__main__":
    main()
