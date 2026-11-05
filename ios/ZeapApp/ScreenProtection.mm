#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <UIKit/UIKit.h>

@interface ScreenProtection : NSObject <RCTBridgeModule>
@end

@implementation ScreenProtection {
  NSInteger _activeCount;
  UITextField *_secureField;
  __weak UIWindow *_securedWindow;
  UIView *_coverView;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup { return YES; }
- (dispatch_queue_t)methodQueue { return dispatch_get_main_queue(); }

- (instancetype)init {
  if (self = [super init]) {
    NSNotificationCenter *center = NSNotificationCenter.defaultCenter;
    [center addObserver:self selector:@selector(updateCover) name:UIScreenCapturedDidChangeNotification object:nil];
    [center addObserver:self selector:@selector(updateCover) name:UIApplicationDidBecomeActiveNotification object:nil];
    [center addObserver:self selector:@selector(coverForSnapshot) name:UIApplicationWillResignActiveNotification object:nil];
  }
  return self;
}

- (void)dealloc {
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

RCT_EXPORT_METHOD(enable) {
  _activeCount += 1;
  [self apply];
}

RCT_EXPORT_METHOD(disable) {
  if (_activeCount > 0) _activeCount -= 1;
  [self apply];
}

- (void)apply {
  if (_activeCount > 0) {
    [self attachSecureLayerToWindow:RCTKeyWindow()];
    _secureField.secureTextEntry = YES;
  } else {
    _secureField.secureTextEntry = NO;
  }
  [self updateCover];
}

- (void)attachSecureLayerToWindow:(UIWindow *)window {
  if (!window || _securedWindow == window) return;
  UITextField *field = [[UITextField alloc] initWithFrame:window.bounds];
  field.userInteractionEnabled = NO;
  field.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  [window addSubview:field];
  [field layoutIfNeeded];
  [window.layer.superlayer addSublayer:field.layer];
  CALayer *canvas = nil;
  if (@available(iOS 17.0, *)) {
    canvas = field.layer.sublayers.lastObject;
  } else {
    canvas = field.layer.sublayers.firstObject;
  }
  if (!canvas) {
    [field removeFromSuperview];
    return;
  }
  canvas.frame = field.layer.bounds;
  [canvas addSublayer:window.layer];
  window.layer.frame = canvas.bounds;
  _secureField = field;
  _securedWindow = window;
}

- (void)updateCover {
  if (_activeCount > 0 && UIScreen.mainScreen.isCaptured) {
    [self showCover];
  } else {
    [self hideCover];
  }
}

- (void)coverForSnapshot {
  if (_activeCount > 0) [self showCover];
}

- (void)showCover {
  UIWindow *window = RCTKeyWindow();
  if (!window) return;
  if (!_coverView) {
    _coverView = [[UIView alloc] init];
    _coverView.backgroundColor = UIColor.blackColor;
    _coverView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  }
  _coverView.frame = window.bounds;
  if (_coverView.superview != window) [window addSubview:_coverView];
  [window bringSubviewToFront:_coverView];
}

- (void)hideCover {
  [_coverView removeFromSuperview];
}

@end
